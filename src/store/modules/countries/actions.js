import api from "@/api";

const getCountries = (context) => {
  api.getUrl(context, "/countries", "COUNTRIES_UPDATED");
};

const getCountryList = (context) => {
  api.getUrl(context, "/countries-list", "COUNTRIES_UPDATED");
};

const getCountry = (context, id) => {
  api.getUrl(context, "/countries/" + id, "COUNTRY_UPDATED");
};

const createCountry = (context, payload) => {
  api.postUrl(context, "/countries", payload, "COUNTRY_UPDATED", {
    name: "CountryShow",
    params: "id",
  });
};

const updateCountry = (context, payload) => {
  api.patchUrl(context, "/countries/" + payload.id, payload, "COUNTRY_UPDATED");
};

const deleteCountry = (context, id) => {
  api.deleteUrl(context, "/countries/" + id, "COUNTRY_RESET");
};

const resetCountry = (context) => {
  context.commit("COUNTRY_RESET");
};

export default {
  getCountries,
  getCountryList,
  getCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  resetCountry,
};
