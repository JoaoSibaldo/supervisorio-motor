
const client = mqtt.connect("wss://test.mosquitto.org:8081");

let dadosRPM = [];
let tempo = [];

const ctx = document.getElementById("graficoRPM").getContext("2d");
const grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: tempo,
    datasets: [{
      label: "RPM da Saída",
      data: dadosRPM,
      borderColor: "#2d89ef",
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: "Tempo (s)" } },
      y: { title: { display: true, text: "RPM" }, beginAtZero: true }
    }
  }
});

client.on("connect", () => {
  console.log("Conectado ao broker MQTT");
  client.subscribe("IFPBCajazeiras/usuario01/data");
  client.subscribe("IFPBCajazeiras/usuario01/Time");
});

client.on("message", (topic, message) => {
  if (topic === "IFPBCajazeiras/usuario01/data") {
    const rpm = parseFloat(message.toString());
    dadosRPM.push(rpm);
    if (dadosRPM.length > 100) dadosRPM.shift();
    grafico.update();
  } else if (topic === "IFPBCajazeiras/usuario01/Time") {
    const t = parseFloat(message.toString());
    tempo.push(t);
    if (tempo.length > 100) tempo.shift();
    grafico.update();
  }
});

function acionarMotor(status) {
  client.publish("IFPBCajazeiras/usuario01/Acionamento", status.toString());
}

function alterarSetpoint() {
  const valor = document.getElementById("setpoint").value;
  client.publish("IFPBCajazeiras/usuario01/setpoint", valor.toString());
}
