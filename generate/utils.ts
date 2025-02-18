import { red, yellow } from "picocolors";

export class Log {
  _level = 1;
  _levelText = "INFO";

  constructor(level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "INFO") {
    let _level = 1;
    switch (level) {
      case "DEBUG":
        _level = 0;
        break;
      case "INFO":
        _level = 1;
        break;
      case "WARN":
        _level = 2;
        break;
      case "ERROR":
        _level = 3;
        break;
    }
    this._level = _level;
    this._levelText = level;
  }

  _time() {
    const date = new Date();
    return date.toLocaleTimeString();
  }

  _fmt(time: string, level: string, message: string) {
    return `${time}:${level} - ${message}`;
  }

  debug(message: string | any, isConnected = false) {
    if (this._level == 0) {
      if (isConnected) {
        message = `↳ ${message}`;
      }
      console.log(this._fmt(this._time(), "DEBUG", message));
      return this._fmt(this._time(), "DEBUG", message);
    }
  }

  info(message: string | any, isConnected = false) {
    if (this._level <= 1) {
      if (isConnected) {
        message = `↳ ${message}`;
      }
      console.log(this._fmt(this._time(), "INFO", message));
      return this._fmt(this._time(), "INFO", message);
    }
  }

  warn(message: string | any, isConnected = false) {
    if (this._level <= 2) {
      if (isConnected) {
        message = `↳ ${message}`;
      }
      console.log(yellow(this._fmt(this._time(), "WARN", message)));
      return this._fmt(this._time(), "WARN", message);
    }
  }

  error(message: string | any, isConnected = false) {
    if (this._level <= 3) {
      if (isConnected) {
        message = `↳ ${message}`;
      }
      console.log(red(this._fmt(this._time(), "ERROR", message)));
      return this._fmt(this._time(), "ERROR", message);
    }
  }
}
