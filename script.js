//Authors notes: the different tabs/functionalities are divided into sections by //--comment--// while other notable lines are commented by //comment, to explain the code better, but only on their first instance in the code

//--------------------------------------------------------First page fetch code-------------------------------------------------//
fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
  .then((response) => response.json())
  .then((data) => {
    const mainData = data.filter((item) => item.hasOwnProperty("id"));
    const tableBody = document.querySelector("#data-table tbody");
    let a = 1; //a simple counter used to fill the number of rows
    current_max_available = Math.min(mainData.length, 29); //checks the amount of data points recieved and filtered from the API

    if (mainData.length === 0) {
      //checks if there are available readings
      const newRow = tableBody.insertRow();

      const newCell = newRow.insertCell();
      newCell.textContent = "No available data";

      newCell.colSpan =
        tableBody.previousElementSibling.getElementsByTagName("th").length;
    } else {
      for (let i = current_max_available; i >= 0; i--) {
        //if there are less than 30, appropriately fills the table from the oldest to the newest value
        const item = data[i]; //the following code creates the data table and puts appropriate names for the variables
        const rowData = [];
        rowData.push(a);
        a++;
        rowData.push(item.date_time.slice(0, 10)); //the code that gets the date part of date_time after slicing
        rowData.push(item.date_time.slice(11, 19)); //the code that gets the time part of date_time after slicing
        Object.keys(item.data).forEach((key) => {
          if (key === "humidity_in") {
            rowData.push("Humidity in");
          } else if (key === "humidity_out") {
            rowData.push("Humidity out");
          } else if (key === "wind_speed") {
            rowData.push("Wind speed");
          } else if (key === "light") {
            rowData.push("Light");
          } else if (key === "wind_direction") {
            rowData.push("Wind direction");
          } else if (key === "rain") {
            rowData.push("Rain");
          } else if (key === "temperature") {
            rowData.push("Temperature");
          } else if (key === "Air_pres_1") {
            rowData.push("Air pressure");
          } else rowData.push(key);
          rowData.push(item.data[key]);
        });

        const row = tableBody.insertRow();
        rowData.forEach((value) => {
          row.insertCell().textContent = value;
        });
      }
    }
  })
  .catch((error) => console.error(error)); //a simple error catch

//--------------------------------------------------------------Initiating the second (temperature) tab and its fetch/main code----------------------------------//

window.addEventListener("load", function () {
  const intervalSelect = document.getElementById("interval-select");
  intervalSelect.value = ""; // Sets the default option to "Now" on load

  intervalSelect.dispatchEvent(new Event("change"));
});

const intervalSelect = document.getElementById("interval-select");
const apiAddress =
  "http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/"; //sets up the base API address that will later be edited based on the
let myChart; //initializes the chart

intervalSelect.addEventListener("change", function () {
  //on change, the appropriate API address is called and its data filtered and added to a table
  const selectedOption = intervalSelect.value;
  const apiUrl = apiAddress + selectedOption;

  fetch(apiUrl) //fetches the appropriate data and does the main computing
    .then((response) => response.json())
    .then((data) => {
      const temperatureData = data.filter((item) =>
        item.hasOwnProperty("temperature")
      );

      const labels = data.map((item) => item.date_time.slice(11, 16));
      const temperatures = data.map((item) => item.temperature);
      const ctx = document.getElementById("temperature-chart").getContext("2d");
      const tableBody = document.querySelector("#second-data-table tbody");
      let a = 1;

      if (temperatureData.length === 0) {
        const newRow = tableBody.insertRow();

        const newCell = newRow.insertCell();
        newCell.textContent = "No available data";

        newCell.colSpan =
          tableBody.previousElementSibling.getElementsByTagName("th").length;
      } else {
        if (myChart) {
          myChart.destroy(); //removes the previous chart, so a new one can be created with the required data
        }
        tableBody.innerHTML = ""; //removes the previous table body, so a new one can be created with the required data

        temperatureData.forEach((item) => {
          const rowData = [];
          rowData.push(a);
          a++;
          rowData.push(item.date_time.slice(0, 10));
          rowData.push(item.date_time.slice(11, 19));
          rowData.push(item.temperature);

          const row = tableBody.insertRow();
          rowData.forEach((value) => {
            row.insertCell().textContent = value;
          });
        });

        myChart = new Chart(ctx, {
          //code that creates the chart and tells it what information to display
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature(Celsius)",
                data: temperatures,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "red",
                tension: 0.1,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "black",
                  font: {
                    weight: 800,
                  },
                },
              },
            },
          },
        });
      }
    })
    .catch((error) => console.error(error));
});

//------------------------------------------------------------------------------Code that runs the third tab, including the wind speed fetch and the data to run it---------------------------//

window.addEventListener("load", function () {
  const windintervalSelect = document.getElementById("wind-interval-select");
  windintervalSelect.value = "";

  windintervalSelect.dispatchEvent(new Event("change"));
});

const windintervalSelect = document.getElementById("wind-interval-select");
const windapiAddress =
  "http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/";
let myWindChart;

windintervalSelect.addEventListener("change", function () {
  const selectedOption = windintervalSelect.value;
  const windapiUrl = windapiAddress + selectedOption;

  fetch(windapiUrl)
    .then((response) => response.json())
    .then((data) => {
      const wind_speedData = data.filter((item) =>
        item.hasOwnProperty("wind_speed")
      );

      const labels2 = data.map((item) => item.date_time.slice(11, 16));

      const wind_speeds = data.map((item) => item.wind_speed);
      const ctx2 = document.getElementById("wind-speed-chart").getContext("2d");
      const tableBody = document.querySelector("#third-data-table tbody");
      let a = 1;

      if (wind_speedData.length === 0) {
        const newRow = tableBody.insertRow();

        const newCell = newRow.insertCell();
        newCell.textContent = "No available data";

        newCell.colSpan =
          tableBody.previousElementSibling.getElementsByTagName("th").length;
      } else {
        if (myWindChart) {
          myWindChart.destroy();
        }
        tableBody.innerHTML = "";
        wind_speedData.forEach((item) => {
          const rowData = [];
          rowData.push(a);
          a++;
          rowData.push(item.date_time.slice(0, 10));
          rowData.push(item.date_time.slice(11, 19));
          rowData.push(item.wind_speed);

          const row = tableBody.insertRow();
          rowData.forEach((value) => {
            row.insertCell().textContent = value;
          });
        });
        myWindChart = new Chart(ctx2, {
          type: "bar",
          data: {
            labels: labels2,
            datasets: [
              {
                label: "Wind Speed",
                data: wind_speeds,

                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "red",
                tension: 0.1,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "black",
                  font: {
                    weight: 800,
                  },
                },
              },
            },
          },
        });
      }
    })
    .catch((error) => console.error(error));
});

//--------------------------------------------------------------Code that runs the custom search page--------------------------------------------------------//

window.addEventListener("load", function () {
  const customIntervalSelect = document.getElementById(
    "custom-interval-select"
  );
  const customTypeSelect = document.getElementById("custom-type-select");
  customIntervalSelect.value = "";
  customTypeSelect.value = "rain";                                 //sets the default type on load to rain

  customIntervalSelect.dispatchEvent(new Event("change"));
  customTypeSelect.dispatchEvent(new Event("change"));
});

const customIntervalSelect = document.getElementById("custom-interval-select");
const customTypeSelect = document.getElementById("custom-type-select");

const customApiAddress = "http://webapi19sa-1.course.tamk.cloud/v1/weather/";

let myCustomChart;

customIntervalSelect.addEventListener("change", function () {     //changes the table and chart to display the proper data when the time interval gets changed
  const theIntervalSelect = document.getElementById("custom-interval-select");
  const customTypeSelect = document.getElementById("custom-type-select");
  const customSelectedOption = theIntervalSelect.value;
  const selectedType = customTypeSelect.value;
  const customApiUrl =
    customApiAddress + selectedType + "/" + customSelectedOption;

  if (customSelectedOption === "") {                               //the if statement processes the "Now" view, since its specifications are that it has 25 or as many data points as are currently available       
    fetch(customApiAddress)                                        //it draws its information from the latest 500 measurements, and reads that data
      .then((response) => response.json())
      .then((data) => {
        const customData2 = data.filter((item) =>
          item.data.hasOwnProperty(selectedType)
        );

        const customTimeDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.date_time.slice(11, 16);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const customDateDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.date_time.slice(0, 10);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const customValueDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.data[selectedType];
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const dataPoints = [];
        lower_value = Math.min(24, customData2.length);      //the custom view has 25 items showing instead of the 20 on the temperature/wind pages, thus the following code
        for (let b = lower_value; b >= 0; b--) {
          dataPoints[b] = customValueDataSet[b];
        }

        const timeDataPoints = [];
        lower_value = Math.min(24, customData2.length);
        for (let b = lower_value; b >= 0; b--) {
          timeDataPoints[b] = customTimeDataSet[b];
        }

        const ctx3 = document
          .getElementById("custom-speed-chart")
          .getContext("2d");
        const tableBody = document.querySelector("#custom-data-table tbody");
        let a = 1;

        if (customData2.length === 0) {
          tableBody.innerHTML = "";
          const newRow = tableBody.insertRow();
          const newCell = newRow.insertCell();
          newCell.textContent = "No available data";
          newCell.colSpan =
            tableBody.previousElementSibling.getElementsByTagName("th").length;
        } 
        else {
          lower_value = Math.min(25, customData2.length);

          if (myCustomChart) {
            myCustomChart.destroy();
          }
          tableBody.innerHTML = "";
          for (let i = lower_value - 1; i >= 0; i--) {
            const rowData = [];
            rowData.push(a);
            a++;
            rowData.push(customDateDataSet[i]);
            rowData.push(customTimeDataSet[i]);
            rowData.push(customValueDataSet[i]);

            const row = tableBody.insertRow();
            rowData.forEach((value) => {
              row.insertCell().textContent = value;
            });
          }
          const filteredOutType =                                          //changes the name of the data on the chart to more user-friendly names
            selectedType === "humidity_out"
              ? "Humidity out"
              : selectedType === "temperature"
              ? "Temperature"
              : selectedType === "humidity_in"
              ? "Humidity in"
              : selectedType === "rain"
              ? "Rain"
              : selectedType === "light"
              ? "Humidity in"
              : selectedType === "wind_speed"
              ? "Wind speed"
              : selectedType === "wind_direction"
              ? "Wind direction"
              : selectedType;

          myCustomChart = new Chart(ctx3, {
            type: "line",
            data: {
              labels: timeDataPoints,
              datasets: [
                {
                  label: filteredOutType,
                  data: dataPoints,
                  borderColor: "red",
                  backgroundColor: "red",
                  tension: 0.1,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "black",
                    font: {
                      weight: 800,
                    },
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  } 
  else {                                                                     //other options, if "Now" wasn't selected
    fetch(customApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const customData2 = data.filter((item) =>
          item.hasOwnProperty(selectedType)
        );

        const labels2 = data.map((item) => item.date_time.slice(11, 16));
        const customDataSet = data.map((item) => item[selectedType]);

        const ctx3 = document
          .getElementById("custom-speed-chart")
          .getContext("2d");
        const tableBody = document.querySelector("#custom-data-table tbody");
        let a = 1;

        if (customData2.length === 0) {
          tableBody.innerHTML = "";
          const newRow = tableBody.insertRow();

          const newCell = newRow.insertCell();
          newCell.textContent = "No available data";

          newCell.colSpan =
            tableBody.previousElementSibling.getElementsByTagName("th").length;
        } else {
          if (myCustomChart) {
            myCustomChart.destroy();
          }
          tableBody.innerHTML = "";
          customData2.forEach((item) => {
            const rowData = [];
            rowData.push(a);
            a++;
            rowData.push(item.date_time.slice(0, 10));
            rowData.push(item.date_time.slice(11, 19));
            rowData.push(item[selectedType]);

            const row = tableBody.insertRow();
            rowData.forEach((value) => {
              row.insertCell().textContent = value;
            });
          });
          const filteredOutType =
            selectedType === "humidity_out"
              ? "Humidity out"
              : selectedType === "temperature"
              ? "Temperature"
              : selectedType === "humidity_in"
              ? "Humidity in"
              : selectedType === "rain"
              ? "Rain"
              : selectedType === "light"
              ? "Humidity in"
              : selectedType === "wind_speed"
              ? "Wind speed"
              : selectedType === "wind_direction"
              ? "Wind direction"
              : selectedType;
          myCustomChart = new Chart(ctx3, {
            type: "line",
            data: {
              labels: labels2,
              datasets: [
                {
                  label: filteredOutType,
                  data: customDataSet,
                  borderColor: "red",
                  backgroundColor: "red",
                  tension: 0.1,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "black",
                    font: {
                      weight: 800,
                    },
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  }
});

customTypeSelect.addEventListener("change", function () {                          //changes the table and chart when the type is changed
  const customSelectedOption = customIntervalSelect.value;
  const selectedType = customTypeSelect.value;
  const customApiUrl =
    customApiAddress + selectedType + "/" + customSelectedOption;
  if (customSelectedOption === "") {                                               //checks if the selected option is "Now"
    fetch(customApiAddress)
      .then((response) => response.json())
      .then((data) => {
        const customData2 = data.filter((item) =>
          item.data.hasOwnProperty(selectedType)
        );

        const customTimeDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.date_time.slice(11, 16);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const customDateDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.date_time.slice(0, 10);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const customValueDataSet = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedType)) {
              return item.data[selectedType];
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const dataPoints = [];
        lower_value = Math.min(24, customData2.length); 
        for (let b = lower_value; b >= 0; b--) {
          dataPoints[b] = customValueDataSet[b];
        }

        const timeDataPoints = [];
        lower_value = Math.min(24, customData2.length); 
        for (let b = lower_value; b >= 0; b--) {
          timeDataPoints[b] = customTimeDataSet[b];
        }

        const ctx3 = document
          .getElementById("custom-speed-chart")
          .getContext("2d");
        const tableBody = document.querySelector("#custom-data-table tbody");
        let a = 1;

        if (customData2.length === 0) {
          tableBody.innerHTML = "";
          const newRow = tableBody.insertRow();

          const newCell = newRow.insertCell();
          newCell.textContent = "No available data";

          newCell.colSpan =
            tableBody.previousElementSibling.getElementsByTagName("th").length;
        } else {
          lower_value = Math.min(25, customData2.length);

          if (myCustomChart) {
            myCustomChart.destroy();
          }
          tableBody.innerHTML = "";
          for (let i = lower_value - 1; i >= 0; i--) {
            const rowData = [];
            rowData.push(a);
            a++;
            rowData.push(customDateDataSet[i]);
            rowData.push(customTimeDataSet[i]);
            rowData.push(customValueDataSet[i]);

            const row = tableBody.insertRow();
            rowData.forEach((value) => {
              row.insertCell().textContent = value;
            });
          }
          const filteredOutType =
            selectedType === "humidity_out"
              ? "Humidity out"
              : selectedType === "temperature"
              ? "Temperature"
              : selectedType === "humidity_in"
              ? "Humidity in"
              : selectedType === "rain"
              ? "Rain"
              : selectedType === "light"
              ? "Humidity in"
              : selectedType === "wind_speed"
              ? "Wind speed"
              : selectedType === "wind_direction"
              ? "Wind direction"
              : selectedType;

          myCustomChart = new Chart(ctx3, {
            type: "line",
            data: {
              labels: timeDataPoints,
              datasets: [
                {
                  label: filteredOutType,
                  data: dataPoints,
                  borderColor: "red",
                  backgroundColor: "red",
                  tension: 0.1,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "black",
                    font: {
                      weight: 800,
                    },
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  } else {                                                                           //code for the other time options
    fetch(customApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const customData = data.filter((item) =>
          item.hasOwnProperty(selectedType)
        );

        const labels2 = data.map((item) => item.date_time.slice(11, 16));

        const customDataSet = data.map((item) => item[selectedType]);
        const ctx3 = document
          .getElementById("custom-speed-chart")
          .getContext("2d");
        const tableBody = document.querySelector("#custom-data-table tbody");
        let a = 1;

        if (customData.length === 0) {
          const newRow = tableBody.insertRow();

          const newCell = newRow.insertCell();
          newCell.textContent = "No available data";

          newCell.colSpan =
            tableBody.previousElementSibling.getElementsByTagName("th").length;
        } else {
          if (myCustomChart) {
            myCustomChart.destroy();
          }
          tableBody.innerHTML = "";
          customData.forEach((item) => {
            const rowData = [];
            rowData.push(a);
            a++;
            rowData.push(item.date_time.slice(0, 10));
            rowData.push(item.date_time.slice(11, 19));
            rowData.push(item[selectedType]);

            const row = tableBody.insertRow();
            rowData.forEach((value) => {
              row.insertCell().textContent = value;
            });
          });
          const filteredOutType =
            selectedType === "humidity_out"
              ? "Humidity out"
              : selectedType === "temperature"
              ? "Temperature"
              : selectedType === "humidity_in"
              ? "Humidity in"
              : selectedType === "rain"
              ? "Rain"
              : selectedType === "light"
              ? "Humidity in"
              : selectedType === "wind_speed"
              ? "Wind speed"
              : selectedType === "wind_direction"
              ? "Wind direction"
              : selectedType;

          myCustomChart = new Chart(ctx3, {
            type: "line",
            data: {
              labels: labels2,
              datasets: [
                {
                  label: filteredOutType,
                  data: customDataSet,
                  borderColor: "red",
                  backgroundColor: "red",
                  tension: 0.1,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "black",
                    font: {
                      weight: 800,
                    },
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  }
});

//-----------------------------------------------------------------The code that controls the buttons, hiding and showing the different tabs----------------------//

const tab1Button = document.getElementById("tab1");
const tab2Button = document.getElementById("tab2");
const tab3Button = document.getElementById("tab3");
const tab4Button = document.getElementById("tab4");
const tab5Button = document.getElementById("tab5");
const mode_button = document.getElementById("colourModeButton");

const content1 = document.getElementById("content1");
const content2 = document.getElementById("content2");
const content3 = document.getElementById("content3");
const content4 = document.getElementById("content4");
const content5 = document.getElementById("content5");
const temperature_layout = document.getElementById("table_graph_container");

tab1Button.addEventListener("click", function () {
  first_container.style.display = "flex";
  content2.style.display = "none";
  content3.style.display = "none";
  content4.style.display = "none";
  content5.style.display = "none";
  table_graph_container.style.display = "none";
});
tab2Button.addEventListener("click", function () {
  content2.style.display = "flex";
  table_graph_container.style.display = "flex";
  first_container.style.display = "none";
  content3.style.display = "none";
  content4.style.display = "none";
  content5.style.display = "none";
});
tab3Button.addEventListener("click", function () {
  content3.style.display = "block";
  first_container.style.display = "none";
  content2.style.display = "none";
  content4.style.display = "none";
  content5.style.display = "none";
  table_graph_container.style.display = "none";
});
tab4Button.addEventListener("click", function () {
  content4.style.display = "block";
  first_container.style.display = "none";
  content2.style.display = "none";
  content3.style.display = "none";
  content5.style.display = "none";
  table_graph_container.style.display = "none";
});
tab5Button.addEventListener("click", function () {
  content5.style.display = "block";
  first_container.style.display = "none";
  content2.style.display = "none";
  content3.style.display = "none";
  content4.style.display = "none";
  table_graph_container.style.display = "none";
});

//---------------------------------The extra-feature, a colour mode button that allows the user to switch between a light and a darker mode, so the screen isn't too bright during night time--------//

const bodyReference = document.getElementById("bodyId");
const navBarReference = document.getElementById("button-nav");
const buttons = document.querySelectorAll(".button-links button");
const thElements = document.querySelectorAll("th");

var isClicked = true; //a flag that helps track wether the button has been clicked or not
mode_button.addEventListener("click", function () {
  //the main color swap code
  if (isClicked) {
    buttons.forEach((button) => {
      button.style.backgroundColor =
        button.style.backgroundColor === "#000328" ? "#4D6489" : "#000328";
      button.classList.add("clicked");
    });

    thElements.forEach((th) => {
      th.style.backgroundColor = "#D3D3D3";
    });

    navBarReference.style.backgroundColor = "#36454f";

    bodyReference.style.backgroundColor = "#6e7f80";
    isClicked = false;                                           //the value of the flag is changed so the other option runs the next time its clicked
  } else {
    //the next time the button is clicked, the following code reverts the colors
    mode_button.classList.remove("clicked");

    buttons.forEach((button) => {
      button.style.backgroundColor =
        button.style.backgroundColor === "#4D6489" ? "#000328" : "#4D6489";
      button.classList.remove("clicked");
    });

    thElements.forEach((th) => {
      th.style.backgroundColor = "#f4ebde";
    });

    navBarReference.style.backgroundColor = "#6384a2";

    bodyReference.style.backgroundColor = "#f4ebde";
    isClicked = true;                                                 //flag value change
  }
});
