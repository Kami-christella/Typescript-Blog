// builtinModule.ts
import path from 'path';
import sayHello from './greeting';

console.log('Current File:', path.basename(__filename));
console.log('Directory:', path.basename(__dirname));
console.log(sayHello('Klab Team'));