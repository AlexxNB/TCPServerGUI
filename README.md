# TCP Server GUI

<p align="center">
  <img src="https://github.com/AlexxNB/TCPServerGUI/raw/master/screenshot.png">
</p>

The TCP Server with GUI to debug TCP connections.

## Usage

If you have installed Node on your PC just run:

```sh
npx tcpsrv
```

Then point your browser on [http://localhost:7000](http://localhost:7000) to see the Web GUI.

Clients may connect using `localhost:6969` address. You will see them in connections list in Web GUI. Choose any connection and then you can send and receive bytes from this connection. 

> Run `npx tcpsrv --help` to see available options

## Echo-client

For testing purposes you can run a client which will be connected to the server, sends `Hello!` message and then will resend all received bytes back to the server.

```sh
npx tcpsrv --echo
```

> Be sure that you use same host/port configuration as used in server