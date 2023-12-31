import fetch from 'node-fetch';

function useFetch(baseUrl) {
  // const [loading, setLoading] = useState(true);

  function get(url, header = {}) {
    return new Promise((resolve, reject) => {
      fetch(baseUrl + url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            // setLoading(false);
            return reject(data);
          }
          // setLoading(false);
          resolve(data);
        })
        .catch((error) => {
          // setLoading(false);
          reject(error);
        });
    });
  }

  function post(url, body, header = {}) {
    return new Promise((resolve, reject) => {
      fetch(baseUrl + url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            // setLoading(false);
            return reject(data);
          }
          // setLoading(false);
          resolve(data);
        })
        .catch((error) => {
          // setLoading(false);
          reject(error);
        });
    });
  }

  return { get, post };
}


export default useFetch;