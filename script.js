let client;
let chart;
let tempo = 0;
let motorLigado = false;

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "TCC_CJ" && pass === "CJ_IFPB") {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    iniciarApp();
  } else {
    document.getElementById("login-error").classList.remove("hidden");
  }
}

function iniciarApp() {
  client = mqtt.connect("wss://test.mosquitto.org:8081");

  client.on("connect", () => {
    client.subscribe("IFPBCajazeiras/usuario01/data");
    client.subscribe("IFPBCajazeiras/usuario01/Time");
  });

  const ctx = document.getElementById("rpmChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "RPM",
          data: [],
          borderColor: "blue",
          fill: false
        },
        {
          label: "Setpoint",
          data: [],
          borderColor: "orange",
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: {
          min: 0,
          max: 150,
          title: {
            display: true,
            text: 'RPM'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tempo (s)'
          }
        }
      }
    }
  });

  client.on("message", (topic, message) => {
    if (topic === "IFPBCajazeiras/usuario01/data") {
      const rpm = parseFloat(message.toString());
      chart.data.labels.push(tempo);
      chart.data.datasets[0].data.push(rpm);
      chart.update();
    }

    if (topic === "IFPBCajazeiras/usuario01/Time") {
      tempo = parseFloat(message.toString());
    }
  });
}

function ligarMotor() {
  motorLigado = true;
  client.publish("IFPBCajazeiras/usuario01/Acionamento", "ON");
  document.getElementById("led").className = "led green";
  document.getElementById("status-text").textContent = "Motor Ligado";
  document.getElementById("spinner").classList.remove("hidden");
}

function desligarMotor() {
  motorLigado = false;
  client.publish("IFPBCajazeiras/usuario01/Acionamento", "OFF");
  document.getElementById("led").className = "led red";
  document.getElementById("status-text").textContent = "Motor Desligado";
  document.getElementById("spinner").classList.add("hidden");
}

function enviarSetpoint() {
  const sp = document.getElementById("setpoint-input").value;
  client.publish("IFPBCajazeiras/usuario01/setpoint", sp);
  chart.data.datasets[1].data.push(parseFloat(sp));
}
