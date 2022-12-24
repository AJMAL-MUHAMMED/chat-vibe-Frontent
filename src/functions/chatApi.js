import axios from "axios"

export const userChats = async (userId, token) => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chat/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        return (data);
    } catch (error) {
        return error
    }
}

export const getMessages = async (chatId, token) => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/message/${chatId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return data;
    } catch (error) {
        return error;
    }
}

export const addMessage = async (message, token) => {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/message`,
        message,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return data;
    } catch (error) {
        return error;
    }
}