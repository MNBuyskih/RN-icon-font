import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {IconFont} from './assets/iconFont/IconFont';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />

          <View style={styles.body}>
            <IconFont.Circle style={{fontSize: 46, color: 'red'}} />
            <IconFont.Rectangle style={{fontSize: 46, color: 'blue'}} />
            <IconFont.Polygon style={{fontSize: 46, color: 'green'}} />
            <IconFont.Star style={{fontSize: 46, color: 'orange'}} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
});

export default App;
