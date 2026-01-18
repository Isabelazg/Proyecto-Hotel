import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	const aiRoutes = [
		"/cdp/extract-pdf",
		"/autorizaciones/extract-pdf",
		"/hoja-de-vida/extract-pdf",
	];
	const isAIRoute = aiRoutes.some((route) => req.path.includes(route));
	if (isAIRoute) {
		req.setTimeout(120000);
		res.setTimeout(120000);
	}
	next();
});

const API_VERSION = "/api/v1";

app.get(`${API_VERSION}/health`, (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use((req, res, next) => {
	res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Error interno del servidor";
	res.status(status).json({ message });
});

export default app;
