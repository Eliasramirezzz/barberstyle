// Pagina de error para 404, 500, etc

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Not Found Page</h1>
      <p className="text-lg">Página no encontrada</p>
      <p className="text-lg">Error 404</p>
    </div>
  );
};

export default NotFoundPage;
