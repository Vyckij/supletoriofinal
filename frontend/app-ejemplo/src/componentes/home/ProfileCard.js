import React from "react";
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

//const pinterest = <Icon name={'pinterest'} size={60} color={'black'} />;
const pinterest = <Icon name={'home'} size={60} color={'black'} />;

const spotify = <Icon name={'spotify'} size={60} color={'black'} />;
const reddit = <Icon name={'reddit'} size={60} color={'black'} />;
const github = <Icon name={'github'} size={60} color={'black'} />;


const socialMediaLinks = [
  { icon: pinterest, url: 'https://es.pinterest.com/jessicavictoria2013/', label: 'Pinterest' },
  { icon: spotify, url: 'https://open.spotify.com/user/jessvyc', label: 'Spotify' },
  { icon: reddit, url: 'https://www.reddit.com/u/elvis6686/s/YIvvdDCPN', label: 'Reddit' },
  { icon: github, url: 'https://github.com/emherrerat', label: 'GitHub' },
];

const ProfileCard = () => {
  const user = {
    avatar:"/Users/jessicavictoria/Desktop/aplicacionmovil/frontend/app-ejemplo/imagenes/nuevolog.gif",
    //avatar: "https://yt3.googleusercontent.com/ytc/AIf8zZRc8i9Eiriy_iYiXGJyx7okItuG8C7gw47Mnjyb1w=s176-c-k-c0x00ffffff-no-rj",
    coverPhoto: "https://travelwandergrow.com/wp-content/uploads/2018/01/AdobeStock_264773707-scaled.jpeg",
    name: "Jessica Victoria"
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.coverPhoto }} style={styles.coverPhoto} />
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {socialMediaLinks.map((socialMedia, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconContainer}
            onPress={() => Linking.openURL(socialMedia.url)}
          >
            {socialMedia.icon}
            <Text style={styles.iconLabel}>{socialMedia.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center', // flex y grid
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -75
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: 'white'
  },
  name: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '80%',
    justifyContent: 'space-around'
  },
  iconContainer: {
    alignItems: 'center'
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: 'black'
  }
});

export default ProfileCard;

