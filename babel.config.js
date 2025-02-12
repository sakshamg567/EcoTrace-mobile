module.exports = function (api) {
   api.cache(true);
   return {
   presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", ["@babel/preset-react", {runtime: 'automatic'},],
      
   ],
   plugins: [
      [
         "@babel/plugin-transform-react-jsx",
         {
         runtime: "automatic",
         importSource: "nativewind",
         },
      ],
   ],
};
};