// AnimatedSwipeCards.js
import React from 'react';
import { View, Animated } from 'react-native';
import SwipeCards from 'react-native-swipe-cards';

const AnimatedSwipeCards = ({ cards, renderCard, handleYup, handleNope }) => {
  // Use native driver for animations
  const animatedValue = new Animated.Value(0);

  return (
    <View style={{ flex: 1 }}>
      <SwipeCards
        cards={cards}
        renderCard={renderCard}
        handleYup={handleYup}
        handleNope={handleNope}
        // You may need to pass additional props if the library supports them
        // Example: animateCard, swipeAnimation, etc.
        animateCard
      />
    </View>
  );
};

export default AnimatedSwipeCards;
