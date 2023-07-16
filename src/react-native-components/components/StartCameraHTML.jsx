export default template = () => {
  return String.raw`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Start Camera html</title>
  </head>
  <body>
    <h1>StartCameraHTML ./src/StartCameraHTML.html ada</h1>
    <a href="https://www.google.com">GOOGLE SEARCH</a>

    <div id="root"></div>
    <script src="https://unpkg.com/react/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
      crossorigin></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
      crossorigin></script>
    <script src="./StartCamera.jsx"></script>
    <script>
      ReactDOM.render(
        React.createElement(StartCamera.default),
        document.getElementById('root'),
      );
    </script>
  </body>
</html>
`;
};
