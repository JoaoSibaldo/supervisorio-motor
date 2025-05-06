
let client = mqtt.connect("wss://test.mosquitto.org:8081");

let timeData = [];
let rpmData = [];
let setpointData = [];
let timeCounter = 0;
let motorOn = false;

client.on("connect", function () {
  client.subscribe("IFPBCajazeiras/usuario01/data");
  client.subscribe("IFPBCajazeiras/usuario01/setpoint");
  client.subscribe("IFPBCajazeiras/usuario01/Acionamento");
});

client.on("message", function (topic, message) {
  const msg = message.toString();
  if (topic === "IFPBCajazeiras/usuario01/data") {
    if (motorOn) {
      timeData.push(timeCounter++);
      rpmData.push(parseFloat(msg));
      setpointData.push(lastSetpoint);
      if (timeData.length > 100) {
        timeData.shift();
        rpmData.shift();
        setpointData.shift();
      }
      rpmChart.update();
    }
  } else if (topic === "IFPBCajazeiras/usuario01/setpoint") {
    lastSetpoint = parseFloat(msg);
  } else if (topic === "IFPBCajazeiras/usuario01/Acionamento") {
    if (msg === "1") {
      motorOn = true;
      document.getElementById("motor-status-led").className = "led green";
      document.getElementById("motor-status-text").textContent = "Motor Ligado";
      document.getElementById("motor-animation").style.display = "block";
    } else {
      motorOn = false;
      document.getElementById("motor-status-led").className = "led red";
      document.getElementById("motor-status-text").textContent = "Motor Desligado";
      document.getElementById("motor-animation").style.display = "none";
    }
  }
});

function sendCommand(value) {
  client.publish("IFPBCajazeiras/usuario01/Acionamento", value.toString());
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "TCC_CJ" && pass === "CJ_IFPB") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-interface").style.display = "block";
  } else {
    document.getElementById("login-error").textContent = "Usuário ou senha incorretos.";
  }
}

let lastSetpoint = 0;
const ctx = document.getElementById("rpmChart").getContext("2d");
const rpmChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: timeData,
    datasets: [
      {
        label: "RPM",
        data: rpmData,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Setpoint",
        data: setpointData,
        borderColor: "red",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  },
  options: {
    animation: false,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 150,
        title: { display: true, text: "RPM" },
      },
      x: {
        title: { display: true, text: "Tempo (s)" },
      },
    },
  },
});
