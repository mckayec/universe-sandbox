const fs=require('fs'),vm=require('vm');
module.exports=f=>{const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);return JSON.parse(JSON.stringify(Object.values(c.window.ATLAS_PACKS)[0]));};
