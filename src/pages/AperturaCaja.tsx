import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EmpleadoSelector } from "@/components/EmpleadoSelector";

const AperturaCaja = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cajaPlantaBaja, setCajaPlantaBaja] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");

  const [formData, setFormData] = useState({
    empleadoId: "",
    montoInicial: "",
    observaciones: "",
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: new Date().toTimeString().slice(0, 5),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userId = "00000000-0000-0000-0000-000000000000";
      setUserId(userId);

      const { data: cajaData, error: cajaError } = await supabase
        .from("cajas")
        .select("*")
        .eq("activa", true)
        .eq("tipo", "comercial")
        .eq("ubicacion", "Planta Baja")
        .single();

      if (cajaError) throw cajaError;
      setCajaPlantaBaja(cajaData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verificarAperturaActiva = async (cajaId: string) => {
    const { data: turnosActivos } = await supabase
      .from("turnos")
      .select(`
        id,
        aperturas (
          id,
          cerrada
        )
      `)
      .eq("caja_id", cajaId)
      .eq("usuario_id", userId)
      .eq("estado", "abierto");

    if (turnosActivos && turnosActivos.length > 0) {
      const tieneAperturaActiva = turnosActivos.some((turno: any) =>
        turno.aperturas && turno.aperturas.some((apertura: any) => !apertura.cerrada)
      );
      return tieneAperturaActiva;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cajaPlantaBaja) {
      toast({
        title: "Error",
        description: "No se encontró la caja de Planta Baja",
        variant: "destructive",
      });
      return;
    }

    if (!formData.empleadoId) {
      toast({
        title: "Campo requerido",
        description: "Debes seleccionar un empleado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const tieneAperturaActiva = await verificarAperturaActiva(cajaPlantaBaja.id);
      if (tieneAperturaActiva) {
        toast({
          title: "Apertura activa existente",
          description: "Ya tienes una apertura activa en esta caja. Debes cerrarla antes de abrir un nuevo turno.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: turno, error: turnoError } = await supabase
        .from("turnos")
        .insert({
          caja_id: cajaPlantaBaja.id,
          usuario_id: userId,
          empleado_id: formData.empleadoId,
          fecha: formData.fecha,
          hora_inicio: formData.horaInicio,
          estado: "abierto",
        })
        .select()
        .single();

      if (turnoError) throw turnoError;

      const { error: aperturaError } = await supabase
        .from("aperturas")
        .insert({
          turno_id: turno.id,
          monto_inicial: parseFloat(formData.montoInicial),
          observaciones: formData.observaciones || null,
        });

      if (aperturaError) throw aperturaError;

      toast({
        title: "Turno iniciado",
        description: "La caja ha sido abierta correctamente",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Apertura de Caja</h1>
              <p className="text-sm text-muted-foreground">Iniciar nuevo turno</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Datos de Apertura</CardTitle>
            <CardDescription>
              Registra el fondo inicial para comenzar el turno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de Inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Caja</Label>
                <Input
                  value={cajaPlantaBaja ? `${cajaPlantaBaja.nombre} - ${cajaPlantaBaja.ubicacion}` : "Cargando..."}
                  disabled
                  className="w-full bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="empleado">Empleado</Label>
                <EmpleadoSelector
                  value={formData.empleadoId}
                  onChange={(value) => setFormData({ ...formData, empleadoId: value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="montoInicial">Monto Inicial (USD)</Label>
                <Input
                  id="montoInicial"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montoInicial}
                  onChange={(e) => setFormData({ ...formData, montoInicial: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Notas adicionales sobre la apertura..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Turno
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AperturaCaja;
