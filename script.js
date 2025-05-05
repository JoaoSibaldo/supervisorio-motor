
let client = mqtt.connect("wss://test.mosquitto.org:8081/mqtt");
let chart;
let tempo = 0;

let dadosRPM = [];
let dadosTempo = [];

client.on("connect", function () {
  console.log("Conectado ao broker MQTT");
  client.subscribe("IFPBCajazeiras/usuario01/data");
  client.subscribe("IFPBCajazeiras/usuario01/Time");
});

client.on("message", function (topic, message) {
  if (topic === "IFPBCajazeiras/usuario01/data") {
    let rpm = parseFloat(message.toString());
    dadosRPM.push(rpm);
  } else if (topic === "IFPBCajazeiras/usuario01/Time") {
    let t = parseFloat(message.toString());
    dadosTempo.push(t);
    atualizarGrafico();
  }
});

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "TCC_CJ" && pass === "CJ_IFPB") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    inicializarGrafico();
  } else {
    document.getElementById("login-error").innerText = "Credenciais inválidas!";
  }
}

function inicializarGrafico() {
  const ctx = document.getElementById("rpmChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dadosTempo,
      datasets: [{
        label: "RPM da saída",
        data: dadosRPM,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { title: { display: true, text: "Tempo (s)" } },
        y: {
          title: { display: true, text: "RPM" },
          min: 0,
          max: 150,
        }
      }
    }
  });
}

function atualizarGrafico() {
  chart.data.labels = dadosTempo;
  chart.data.datasets[0].data = dadosRPM;
  chart.update();

  if (dadosRPM[dadosRPM.length - 1] > 0) {
    document.getElementById("led-ligado").style.display = "inline-block";
    document.getElementById("led-desligado").style.display = "none";
    document.getElementById("motor-animation").style.display = "block";
  } else {
    document.getElementById("led-ligado").style.display = "none";
    document.getElementById("led-desligado").style.display = "inline-block";
    document.getElementById("motor-animation").style.display = "none";
  }
}

function enviarSetpoint() {
  const sp = document.getElementById("setpoint").value;
  client.publish("IFPBCajazeiras/usuario01/setpoint", sp);
}

function acionarMotor() {
  client.publish("IFPBCajazeiras/usuario01/Acionamento", "true");
}

function desligarMotor() {
  client.publish("IFPBCajazeiras/usuario01/Acionamento", "false");
}
