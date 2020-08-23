var __defineProperty = Object.defineProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};

// src/child.ts
function bbc(num) {
  return num + 2;
}

// src/index.ts
__export(exports, {
  default: () => abc
});
async function abc(num) {
  return 2 + num + bbc(num);
}
function test() {
  console.log(abc(456));
}
test();
//# sourceMappingURL=index.js.map
