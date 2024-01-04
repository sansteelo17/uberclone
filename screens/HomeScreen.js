import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import axios from "axios";
import UberImg from "../assets/uber.png";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavorites from "../components/NavFavorites";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const handleGoogleOnPress = async (data, details) => {
    if (details && details.place_id) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${details.place_id}&key=${GOOGLE_MAPS_APIKEY}`
        );

        const location = response.data.result.geometry.location;
        dispatch(
          setOrigin({
            location: location,
            description: data.description,
          })
        );
        dispatch(setDestination(null));
      } catch (error) {
        console.error("Error fetching place details: ", error);
      }
    }
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={UberImg}
        />

        <GooglePlacesAutocomplete
          placeholder="Where from?"
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          onPress={(data, details = null) => {
            handleGoogleOnPress(data, details);
          }}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          debounce={400} // debounce the requests after user stops typing in ms. Set to 0 to remove debounce. By default 0ms.
        />

        <NavOptions />
        <NavFavorites />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
