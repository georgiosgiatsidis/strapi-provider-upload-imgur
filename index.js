const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  init(providerOptions) {
    const API_URL = 'https://api.imgur.com/3';
    const clientId = providerOptions.clientId;

    return {
      upload(file) {
        return new Promise(async (resolve, reject) => {
          const formData = new FormData();
          formData.append('image', file.buffer);

          const config = {
            headers: {
              Authorization: `Client-ID ${clientId}`,
              ...formData.getHeaders(),
            },
          };

          try {
            const response = await axios.post(
              `${API_URL}/image`,
              formData,
              config
            );

            if (
              response.data &&
              response.data.data &&
              response.status === 200
            ) {
              file.url = response.data.data.link;
              file.provider_metadata = response.data.data;
            }

            resolve();
          } catch (e) {
            reject(e);
          }
        });
      },
      delete(file) {
        return new Promise(async (resolve, reject) => {
          const deletehash = file.provider_metadata.deletehash;

          const config = {
            headers: {
              Authorization: `Client-ID ${clientId}`,
            },
          };

          try {
            await axios.delete(`${API_URL}/image/${deletehash}`, config);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      },
    };
  },
};
