import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchField.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(evt) {
  if (evt.target.value.trim() === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }
  fetchCountries(evt.target.value.trim())
    .then(renderCountryMarkup)
    .catch(showError);
}

function renderCountryMarkup(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    countryList.textContent = '';
  } else if (countries.length > 2 && countries.length < 10) {
    const listMarkUp = countries
      .map(country => {
        return `<li> <img src="${country.flags.svg}" alt="${country.name.official}" width="40px""><span>${country.name.official}</span></li>`;
      })
      .join('');
    countryList.innerHTML = listMarkUp;
    countryInfo.innerHTML = '';
  } else if (countries.length === 1) {
    const infoMarkUp = countries
      .map(country => {
        const languages = Object.values(country.languages).join(', ');
        return `<p><b>Capital:</b> ${country.capital}</p><p><b>Population:</b> ${country.population}</p><p><b>Languages:</b> ${languages}</p>`;
      })
      .join('');
    const listMarkUp = countries
      .map(country => {
        return `<li> <img src="${country.flags.svg}" alt="${country.name.official}" width="40px""> ${country.name.official}</li>`;
      })
      .join('');
    countryInfo.innerHTML = infoMarkUp;
    countryList.innerHTML = listMarkUp;
  }
}

function showError() {
  Notify.failure('Oops, there is no country with that name');
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
