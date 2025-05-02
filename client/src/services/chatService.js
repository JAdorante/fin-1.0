import { api } from './api';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './api';

export const getMessageHistory = async (userId) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error fetching message history:', error);
    throw error;
  }
};

export const sendMessage = async (userId, content) => {
  try {
    // Store user message in Firestore
    const messagesRef = collection(db, 'users', userId, 'messages');
    await addDoc(messagesRef, {
      content,
      sender: 'user',
      timestamp: serverTimestamp()
    });
    
    // Send to backend for processing
    const response = await api.post('/chat', { message: content });
    
    // Store bot response in Firestore
    const botResponse = await addDoc(messagesRef, {
      content: response.data.message,
      sender: 'fin',
      timestamp: serverTimestamp()
    });
    
    return {
      id: botResponse.id,
      content: response.data.message,
      sender: 'fin',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};