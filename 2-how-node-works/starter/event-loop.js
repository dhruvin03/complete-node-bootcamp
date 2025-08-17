const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();

setTimeout(() => console.log('Timer stop 1'), 0)
setImmediate(() => console.log('Immediate 1'))

fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
  if (err) return console.log('Error on FS Read')
  
  console.log('I/O callback function');
  console.log('--------------------------');

  setTimeout(() => console.log('Timer stop 2'), 3000)
  setTimeout(() => console.log('Timer stop 3'), 0)
  setImmediate(() => console.log('Immediate 2'))

  process.nextTick(() => console.log('Process Nexttick'))

  crypto.pbkdf2('password', "salt", 100000, 1024, "sha512", () => {
    console.log(process.pid);
    console.log(Date.now() - start, "Password Encrypted")
  });
  crypto.pbkdf2('password2', "salt", 100000, 1024, "sha512", () => {
    console.log(process.pid);
    console.log(Date.now() - start, "Password Encrypted")
  });
  crypto.pbkdf2('password3', "salt", 100000, 1024, "sha512", () => {
    console.log(process.pid);
    console.log(Date.now() - start, "Password Encrypted")
  });
  crypto.pbkdf2('password4', "salt", 100000, 1024, "sha512", () => {
    console.log(process.pid);
    console.log(Date.now() - start, "Password Encrypted")
  });
})

console.log('This will be called first as it is a top level code');
