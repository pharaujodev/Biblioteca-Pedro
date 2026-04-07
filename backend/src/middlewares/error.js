const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 
    const status = err.status || 500;
    const message = err.message || 'Erro Interno do Servidor';

    res.status(status).json({
        error: {
            status,
            message
        }
    });
};

module.exports = errorHandler;