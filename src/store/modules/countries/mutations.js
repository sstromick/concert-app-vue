const COUNTRIES_UPDATED = (state, countries) => {
  state.countries = countries.data;
};

const COUNTRY_UPDATED = (state, country) => {
  state.country = country.data
}

const COUNTRY_RESET = (state) => {
  state.country = null
}

export default {
  COUNTRIES_UPDATED,
  COUNTRY_UPDATED,
  COUNTRY_RESET
};
