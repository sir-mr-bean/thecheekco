const Product = ({ product }) => {
  return <div>Enter</div>;
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default Product;
