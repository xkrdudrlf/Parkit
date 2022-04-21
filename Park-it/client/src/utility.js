import * as config from "./config";

export const getTimeDiffInHours = (late, early) => {
  const timeDiffInMilliseconds = late.getTime() - early.getTime();
  const timeDiffInHours = timeDiffInMilliseconds / (1000 * 60 * 60);

  return timeDiffInHours;
};

export const convertDateToString = (dateObj, carSpaceInfoDate = false) => {
  let [year, month, day, hour, min] = [
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    dateObj.getHours(),
    dateObj.getMinutes(),
  ];
  month += 1;

  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  if (hour < 10) hour = `0${hour}`;
  if (min < 10) min = `0${min}`;

  if (carSpaceInfoDate) return `${day}/${month}/${year} ${hour}:${min}`;

  return `${year}-${month}-${day} ${hour}:${min}:00`;
};

export const searchCarSpace = async (searchInfo, setIsLoading) => {
  try {
    const queryStrArr = [];
    queryStrArr.push(`address=${searchInfo.address}`);
    queryStrArr.push(
      `startTime=${convertDateToString(searchInfo.startDateTime)}`
    );
    queryStrArr.push(`endTime=${convertDateToString(searchInfo.endDateTime)}`);
    if (searchInfo.radius) queryStrArr.push(`radius=${searchInfo.radius}`);
    const queryStr = queryStrArr.join("&");

    const authToken = localStorage.getItem("parkItAuthToken");
    const url = `${config.SERVER_URL}/api/provider/parking/search/?${queryStr}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (authToken) options.headers.Authorization = "Bearer " + authToken;
    const response = await sendRequest(url, options, setIsLoading);

    if (!response.status || response.status >= 300) throw Error();

    return response.data;
  } catch (e) {
    throw Error();
  }
};

export const fetchCarInfo = async (carId, setIsLoading = () => {}) => {
  let carInfo = null;
  try {
    const authToken = localStorage.getItem("parkItAuthToken");
    const url = `${config.SERVER_URL}/api/consumer/vehicle/${carId}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await sendRequest(url, options, setIsLoading);
    if (!response.status || response.status >= 300) throw Error;

    carInfo = response.data;

    return carInfo;
  } catch (e) {
    throw Error();
  }
};

export const fetchCarSpaceInfo = async (
  carSpaceId,
  setIsLoading = () => {}
) => {
  let carSpaceInfo = null;
  try {
    const authToken = localStorage.getItem("parkItAuthToken");
    const url = `${config.SERVER_URL}/api/provider/parking/${carSpaceId}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await sendRequest(url, options, setIsLoading);
    if (!response.status || response.status >= 300) throw Error;

    carSpaceInfo = response.data;
    const {
      streetAddress,
      city,
      state,
      postcode,
      startTime,
      endTime,
      price,
      size,
      images,
    } = carSpaceInfo;

    carSpaceInfo = {
      address: `${streetAddress}, ${city}, ${state}, ${postcode}`,
      startDateTime: startTime,
      endDateTime: endTime,
      price: price,
      maxVehicleSize: size,
      images: images,
    };

    return carSpaceInfo;
  } catch (e) {
    throw Error();
  }
};

export const getDate = (dateTimeStr) => {
  const [date, time] = dateTimeStr.split(" ");
  const [day, month, year] = date.split("/");
  const [hour, minute] = time.split(":");

  return new Date(year, month - 1, day, hour, minute);
};

export const convertImagesToBase64 = async (imageFiles) => {
  const getBase64 = (imageFile) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        resolve({ image_data: base64String });
      };

      reader.readAsDataURL(imageFile);
    });

  const promises = [];
  for (let i = 0; i < imageFiles.length; ++i) {
    promises.push(getBase64(imageFiles[i]));
  }

  return await Promise.all(promises);
};

export const sendRequest = async (
  url,
  options = { method: "GET", headers: {}, body: null },
  setIsLoading = () => {}
) => {
  let result;

  setIsLoading(true);

  try {
    if (options.body) options.body = JSON.stringify(options.body);

    const response = await fetch(url, options);
    if (response.status === 204) {
      setIsLoading(false);
      return { status: response.status };
    }

    const data = await response.json();
    result = { status: response.status, data: data };
  } catch (err) {
    result = {
      status: null,
      data: `Unhandled error occurred: ${err.message}`,
    };
  }

  setIsLoading(false);

  return result;
};

export const containsLower = (str) => {
  return /[a-z]/.test(str);
};

export const containsUpper = (str) => {
  return /[A-Z]/.test(str);
};

export const containsDigit = (str) => {
  return /[0-9]/.test(str);
};

export const containsOnlyDigis = (str) => {
  return /^[0-9]+$/.test(str);
};
