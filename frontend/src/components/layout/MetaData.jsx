import { Helmet, HelmetProvider } from "react-helmet-async";

const MetaData = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${title} | Farhani Florist Shop`}</title>
      </Helmet>
    </HelmetProvider>
  );
};
export default MetaData;
