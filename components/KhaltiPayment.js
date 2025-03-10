// KhaltiPayment.js
import React from 'react';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config'; // Import the config

const KhaltiPayment = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const khaltiConfig = {
    publicKey: Config.KHALTI_PUBLIC_KEY, // Use the test public key
    productIdentity: 'test_product_id',
    productName: 'Test Product',
    amount: amount * 100, // Khalti expects the amount in paisa
    eventHandler: {
      onSuccess(payload) {
        onPaymentSuccess(payload);
      },
      onError(error) {
        onPaymentError(error);
      },
    },
  };

  const khaltiCheckoutUrl = `https://test-pay.khalti.com/checkout?config=${encodeURIComponent(JSON.stringify(khaltiConfig))}`;


  return (
    <WebView
      source={{ uri: khaltiCheckoutUrl }}
      style={{ flex: 1 }}
    />
  );
};

export default KhaltiPayment;