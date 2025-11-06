import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const operacionesCards = [
    {
      title: "Apertura de Caja",
      description: "Iniciar turno con fondo inicial",
      action: () => navigate("/apertura-caja"),
    },
    {
      title: "Arqueo de Caja",
      description: "Contar efectivo y cerrar turno",
      action: () => navigate("/arqueo-caja"),
    },
    {
      title: "Traslado de Efectivo",
      description: "Enviar efectivo a Caja Principal",
      action: () => navigate("/traslado-efectivo"),
    },
    {
      title: "Recepción de Traslado",
      description: "Recibir efectivo en Caja Principal",
      action: () => navigate("/recepcion-traslado"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Gestión de Efectivo</h1>
              <p className="text-sm text-muted-foreground mt-1">Tienda Catu</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Operaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operacionesCards.map((operacion, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                onClick={operacion.action}
              >
                <CardHeader className="text-center p-8">
                  <CardTitle className="text-xl mb-2">{operacion.title}</CardTitle>
                  <CardDescription className="text-base">{operacion.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => navigate("/historial")}
            >
              <CardHeader className="text-center p-8">
                <CardTitle className="text-lg">Historial</CardTitle>
                <CardDescription>Ver operaciones anteriores</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => toast({ title: "Próximamente", description: "Reportes en desarrollo" })}
            >
              <CardHeader className="text-center p-8">
                <CardTitle className="text-lg">Reportes</CardTitle>
                <CardDescription>Generar reportes Excel</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => toast({ title: "Próximamente", description: "Configuración en desarrollo" })}
            >
              <CardHeader className="text-center p-8">
                <CardTitle className="text-lg">Configuración</CardTitle>
                <CardDescription>Parámetros del sistema</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
