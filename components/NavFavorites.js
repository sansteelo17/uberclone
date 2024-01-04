import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { Icon } from "@rneui/base";
import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { setDestination, setOrigin } from "../slices/navSlice";

const data = [
  {
    id: "123",
    icon: "home",
    location: "Home",
    destination: "Code Street, London, UK",
  },
  {
    id: "456",
    icon: "briefcase",
    location: "Work",
    destination: "London Eye, London, UK",
  },
];

const NavFavorites = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const currentScreen = route.name;

  const searchGooglePlaces = async (destination) => {
    const apiKey = GOOGLE_MAPS_APIKEY; // Replace with your actual Google API key
    const searchQuery = destination;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          searchQuery
        )}&key=${apiKey}`
      );

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching Google Places:", error);
    }
  };

  const onPress = async (destination) => {
    const response = await searchGooglePlaces(destination);

    // console.log(response);

    // console.log(currentScreen);

    if (currentScreen === "HomeScreen") {
      dispatch(
        setOrigin({
          location: response.geometry.location,
          description: destination,
        })
      );

      navigation.navigate("MapScreen");
    } else {
      dispatch(
        setDestination({
          location: response.geometry.location,
          description: destination,
        })
      );

      navigation.navigate("RideOptionsCard");
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { location, destination, icon } }) => (
        <TouchableOpacity
          style={tw`flex-row items-center p-5`}
          onPress={() => onPress(destination)}
        >
          <Icon
            style={tw`mr-4 rounded-full full bg-gray-300 p-3`}
            name={icon}
            type="ionicon"
            color="white"
            size={10}
          />
          <View>
            <Text style={tw`font-semibold text-xl`}>{location}</Text>
            <Text style={tw`text-gray-500`}>{destination}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavFavorites;

const styles = StyleSheet.create({});
