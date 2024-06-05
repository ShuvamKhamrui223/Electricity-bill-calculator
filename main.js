/* Constant declarations */
const CONTRACTED_POWER_LIST = [1.15, 2.3, 3.45, 4.60, 5.75, 6.9, 10.35, 13.8, 17.25, 20.7, 27.6, 34.5, 41.4]

const TIME_PERIOD__MONTHS = [1, 2, 12]
const SUPABASE_URL = "https://zruxjkqlvhombprvsvbe.supabase.co"
const CLIENT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXhqa3FsdmhvbWJwcnZzdmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzOTgyMzUsImV4cCI6MjAyNjk3NDIzNX0.C_Fsb5s7zPs4KrhH8XuBvQrKhJ5-Us71tGYxctnBCa8"
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXhqa3FsdmhvbWJwcnZzdmJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTM5ODIzNSwiZXhwIjoyMDI2OTc0MjM1fQ.6korOAHSmiq38h6dg9NlZ_sD4WSajyIDASUBgnP3kFE"

const FIXED_PRICE = 10,
  NUMBER_OF_DAYS_IN_A_MONTH = 30.4375,
  TEXA_DEG = 0.07,
  IPSE = 0.001,
  CONTAUDIOVISUAL = 0.093634


/* Targeting DOM elements */
// Drop down menu elements
const country_menuElement = document.getElementById('country_menu')

const state_menuElement = document.getElementById('state_menu')

const contracted__power_menuElement = document.getElementById('contracted__power_menu')

const tariff_menuElement = document.getElementById('tariff_menu')


// Input elements
const total__consumption_per_monthElement = document.getElementById('total__consumption_per_month')

const custom__tariff = document.getElementById('custom_tariff')

const peak_hour_consumptionElement = document.getElementById('peak_hour_consumption')

const half_peak_hour_consumptionElement = document.getElementById('half_peak_hour_consumption')

const off_peak_hour_consumptionElement = document.getElementById('off_peak_hour_consumption')

const price_per_kwhElement = document.getElementById('price_per_kwh')

const price_per_contracted_powerElement = document.getElementById('price_per_contracted_power')

// Form
const bill_calculation_formElement = document.getElementById('bill_calculation_form')

const grandTotalBillElement = document.getElementById('grandTotalBill')

const resultElement = document.getElementById('result')

// Varibles for storing user input from the form on submission
let selectedCountry, selectedState, contracted_power, duration, total__consumption_per_month, peak_hour_consumption, half_peak_hour_consumption,
  off_peak_hour_consumption,
  price_per_kwh,
  price_per_contracted_power,
  variable_price


// values from database 
let FROM_SUPABASE, FILTERED_DATA, TF_VALUE = Math.random().toFixed(4),
  TV_TVFV_TVP = Math.random().toFixed(4),
  TVV_TVC = Math.random().toFixed(4),
  TVVz = Math.random().toFixed(4),
  CONTAGEM = Math.floor(Math.random().toFixed(4) * 3) + 1
console.log(CONTAGEM)
// Variables for storing api responses
let countryData = [],
  statesData = []

/* Drop down menu preparation */
// Inserting menu items in the drop down of contracted power menu element
CONTRACTED_POWER_LIST.forEach((item) =>
  contracted__power_menuElement.innerHTML += `<option value=${item}>${item}</option>
`)


// Inserting menu items in the drop down of contracted power menu element
TIME_PERIOD__MONTHS.forEach((item) =>
  tariff_menuElement.innerHTML += `        <option value=${item}>${item}</option>
`
)



/* Element event listeners */
// Event listener for form
bill_calculation_formElement.addEventListener('submit', handleBillCreationForm)

// Event listener for country drop down menu
country_menuElement.addEventListener('change', (e) => getAllStates(e.target.value))


/* Window event listeners*/
// This event listener allows to run a function immediately after HTML content loading to get countries and fill the corresponding element with it
window.addEventListener('DOMContentLoaded', getCountries)

// window.addEventListener("load", getDataFromSupabase)


async function getDataFromSupabase() {

  // Initialize the Supabase client
  const _supabase = supabase.createClient(SUPABASE_URL, CLIENT_API_KEY);

  // Specify the name of the table from which you want to fetch data
  const tableName = 'Tariff_Price';

  // Fetch the data from Supabase
  const { data, error } = await _supabase
    .from(tableName)
    .select('').eq('Pot_Cont', contracted_power.toString().replace('.', ','));

  // If there is an error, log it to the console
  if (error) {
    console.log(error);
  }

  // Otherwise, store the data
  FROM_SUPABASE = data
  setVariablesWithValuesFromSupabase(FROM_SUPABASE)
  //console.log(FROM_SUPABASE)
  if (!data) console.log("no data found")
}

function setVariablesWithValuesFromSupabase(DatafromSupabase) {
  // resultElement.innerHTML = (DatafromSupabase)
  /*
    DatafromSupabase.forEach(item => {
       console.log(item.COD_Proposta)
    })
    */
}


// TODO: call this bill calculation functions after initializing variable_price variable

/* Function declarations */
// Function to handle form submission, it prevents the default behaviour of a form and extracts values of necessary fields
function handleBillCreationForm(formEvent) {

  formEvent.preventDefault()

  selectedCountry = country_menuElement.value

  selectedState = state_menuElement.value

  contracted_power = parseFloat(contracted__power_menuElement.value)

  duration = parseFloat(tariff_menuElement.value) || parseFloat(custom__tariff.value)

  total__consumption_per_month = parseFloat(total__consumption_per_monthElement.value)

  peak_hour_consumption = parseFloat(peak_hour_consumptionElement.value)

  half_peak_hour_consumption = parseFloat(half_peak_hour_consumptionElement.value)

  off_peak_hour_consumption = parseFloat(off_peak_hour_consumptionElement.value)

  price_per_kwh = parseFloat(price_per_kwhElement.value)

  price_per_contracted_power = parseFloat(price_per_contracted_powerElement.value)

  if (total__consumption_per_month)
    calculateVariablePriceWithTotalConsumption(contracted_power, duration,
      total__consumption_per_month,
      price_per_kwh,
      price_per_contracted_power)

  if (peak_hour_consumption && off_peak_hour_consumption && half_peak_hour_consumption)
    calculateVariablePriceWithAllConsumptions(contracted_power, duration,
      peak_hour_consumption,
      off_peak_hour_consumption,
      half_peak_hour_consumption,
      price_per_kwh,
      price_per_contracted_power)


  if (peak_hour_consumption && off_peak_hour_consumption && !half_peak_hour_consumption)
    calculateVariablePriceWithoutHalfPeakConsumption(contracted_power, duration,
      peak_hour_consumption,
      off_peak_hour_consumption,
      price_per_kwh,
      price_per_contracted_power)

  // bill_calculation_formElement.reset()
  //grandTotalBillElement.innerHTML=''
  getDataFromSupabase()
  //FROM_SUPABASE.forEach((item) => console.log(item));

  // console.log(FILTERED_DATA, contracted_power)

}

// This function allows to calculate the expected bill when user only provides total consumption instead of giving bifurcation of peak, half-peak, and off-peak hour electricity consumption
function calculateVariablePriceWithTotalConsumption(contracted_power, duration,
  total__consumption_per_month,
  price_per_kwh,
  price_per_contracted_power) {
  let total_number_of_days = (duration * NUMBER_OF_DAYS_IN_A_MONTH)
  variable_price = (price_per_contracted_power * price_per_kwh) * (30.4375 * duration).toFixed(4)

  calculateGrandTotal(variable_price)
}

// This function allows to calculate expected bill when user has given the bifurcation of peak, half-peak, and off-peak electricity consumption
function calculateVariablePriceWithAllConsumptions(contracted_power, duration,
  peak_hour_consumption,
  off_peak_hour_consumption,
  half_peak_hour_consumption,
  price_per_kwh,
  price_per_contracted_power) {

  let consumption_per_day = (contracted_power / NUMBER_OF_DAYS_IN_A_MONTH) * price_per_contracted_power

  let total_number_of_days = (duration * NUMBER_OF_DAYS_IN_A_MONTH)

  if (CONTAGEM == 1) {
    variable_price = (contracted_power / 30.4375) * TV_TVFV_TVP * (duration * 30)
    //console.log("type of variable price undr cont 1: " + typeof variable_price)

  } else if (CONTAGEM == 2) {
    variable_price = consumption_per_day * (peak_hour_consumption + half_peak_hour_consumption) * total_number_of_days + (consumption_per_day * off_peak_hour_consumption * TVV_TVC * total_number_of_days)
    //console.log("type of variable price undr cont 2: " + typeof variable_price)

  }
  else if (CONTAGEM == 3) {
    variable_price = (consumption_per_day * peak_hour_consumption * TV_TVFV_TVP * total_number_of_days) + (consumption_per_day * half_peak_hour_consumption * TVV_TVC * total_number_of_days) + (consumption_per_day * off_peak_hour_consumption * TVVz * total_number_of_days)
    //  console.log("type of variable price undr cont 3: " + typeof variable_price)

  }
  calculateGrandTotal(variable_price)

}


// This function allows to calculate expected bill when user has given the bifurcation of peak and off-peak electricity consumption only
function calculateVariablePriceWithoutHalfPeakConsumption(contracted_power, duration,
  peak_hour_consumption,
  off_peak_hour_consumption,
  price_per_kwh,
  price_per_contracted_power) {
  let total_number_of_days = (duration * NUMBER_OF_DAYS_IN_A_MONTH)

  let consumption_per_day = (contracted_power / NUMBER_OF_DAYS_IN_A_MONTH) * price_per_contracted_power

  if (CONTAGEM == 1) {
    variable_price = (contracted_power / 30.4375) * TV_TVFV_TVP * (duration * 30)
  } else if (CONTAGEM == 2 || 3) {
    variable_price = consumption_per_day * peak_hour_consumption * total_number_of_days
  }
  calculateGrandTotal(variable_price)

}


function calculateGrandTotal(variable_price) {
  
  let total_number_of_days = duration * 30.4375
  let totalWithoutVAT = parseFloat((FIXED_PRICE * total_number_of_days) + (price_per_contracted_power * parseFloat(variable_price) * total_number_of_days) + (0.07 * duration) + (0.001 * total__consumption_per_month) + (0.093634 * total_number_of_days))

  console.log("typeof fixed_price " + typeof FIXED_PRICE, "price per contracted power " + typeof price_per_contracted_power, "variable_price " + typeof variable_price, "total_number_of_days " + typeof total_number_of_days, "duration " + typeof duration, "total__consumption_per_month " + typeof total__consumption_per_month);


  console.log("without vat: " + totalWithoutVAT, typeof totalWithoutVAT)
  // passing grand total for evaluating VAT upon entire bill
  evaluateVAT(totalWithoutVAT)
  grandTotalBillElement.innerText += "bill without vat will be " + totalWithoutVAT
}



function evaluateVAT(totalWithoutVAT) {
  parseFloat(totalWithoutVAT)
  // console.log(typeof totalWithoutVAT, totalWithoutVAT)
  let totalWithVAT = 0

  if (selectedState == "Madeira" || selectedState == "Azores") {
    totalWithVAT = parseFloat((totalWithoutVAT * 4) / 100)
    console.log("4% exception")
  } else {
    console.log("4% is not applicable")

    if ((contracted_power <= 6.9) && (total__consumption_per_month < 150)) {
      totalWithVAT = ((totalWithoutVAT * 6) / 100)
    }
    else if ((contracted_power <= 6.9) && (total__consumption_per_month < 100)) {
      totalWithVAT = ((totalWithoutVAT * 6) / 100)
    }
    else if (contracted_power <= 3.45) {
      totalWithVAT = ((totalWithoutVAT * 6) / 100)
    }
    else
      totalWithVAT = parseFloat((totalWithoutVAT * 23) / 100)

  }
  let grandTotal = parseFloat(totalWithoutVAT + totalWithVAT).toFixed(2)
  console.log("type of totalWithVAT " + typeof totalWithVAT)
  grandTotalBillElement.innerText += (" your bill with VAT will be " + grandTotal)
  // console.log("with VAT: " + grandTotal)
}



/* Fetching data from external APIs */
// Function to fetch all necessary details of all countries
function getCountries() {
  const coutriesURL = 'https://countriesnow.space/api/v0.1/countries/states/';

  try {
    fetch(coutriesURL)
      .then(response => response.json())
      .then(result => {
        countryData = result.data
        if (result.data)
          populateCountriesDropDownMenu(result.data)
      })
  }
  catch (error) {
    console.error(error);
  }
}


function getAllStates(choosenCountry) {
  let onlyCountry = countryData.filter(country => country.name == choosenCountry)

  populateStateDropDownMenu(onlyCountry[0].states)

}


// Inserting menu items in the drop down of country menu element
function populateCountriesDropDownMenu(countries) {
  countries.forEach((item) =>
    country_menuElement.innerHTML += `        <option value=${item.name}>${item.name}</option>
`
  )
}

function populateStateDropDownMenu(statesOfSelectedCountry) {
  state_menuElement.innerHTML = ''
  state_menuElement.innerHTML = `        <option hidden>Choose your state</option>
`

  if (statesOfSelectedCountry.length > 0)
    statesOfSelectedCountry.forEach(state =>
      state_menuElement.innerHTML += `        <option value=${state.name}>${state.name}</option>
`
    )
}