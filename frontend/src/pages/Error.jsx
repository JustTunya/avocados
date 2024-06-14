import propTypes from 'prop-types';

const Error = ({status, message}) => {
  return (
    <main>
      <h1>ERROR {status}</h1>
      <p>{message}</p>
    </main>
  );
};

Error.propTypes = {
  status: propTypes.number.isRequired,
  message: propTypes.string.isRequired,
};

export default Error;