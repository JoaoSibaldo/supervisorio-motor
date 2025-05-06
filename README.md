# Interface Web - Controle de Motor com ESP32 via MQTT

Este projeto é uma interface web moderna para controle e visualização da velocidade de um motor com ESP32, utilizando MQTT.

## Funcionalidades

- Login com usuário e senha
- Botões para ligar/desligar o motor
- Envio de setpoint
- Gráfico em tempo real da velocidade (RPM)
- Curva do setpoint no gráfico
- LED verde/vermelho indicando status do motor
- Animação visual de motor girando

## Tópicos MQTT utilizados

- `IFPBCajazeiras/usuario01/data`: velocidade atual (RPM)
- `IFPBCajazeiras/usuario01/setpoint`: valor do setpoint
- `IFPBCajazeiras/usuario01/Acionamento`: controle ON/OFF
- `IFPBCajazeiras/usuario01/Time`: tempo de execução

## Como hospedar

Você pode hospedar esta interface no [Vercel](https://vercel.com) ou GitHub Pages:

1. Crie um repositório no GitHub
2. Faça upload dos arquivos `index.html`, `style.css`, `script.js` e `README.md`
3. Vincule seu repositório ao Vercel e implante automaticamente

---

**Autor**: Projeto TCC - Instituto Federal da Paraíba - Campus Cajazeiras
