import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmpleadoSelector } from "@/components/EmpleadoSelector";

const ArqueoCaja = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [aperturaActiva, setAperturaActiva] = useState<any>(null);
  const [umbralDiferencia, setUmbralDiferencia] = useState(2.00);

  const [formData, setFormData] = useState({
    empleadoId: "",
    montoContado: "",
    montoFinal: "",
    comentario: "",
  });

  const [diferencia, setDiferencia] = useState<number | null>(null);
  const [pagosProveedores, setPagosProveedores] = useState<any[]>([]);
  const [contadorDocNoAutorizado, setContadorDocNoAutorizado] = useState(1);
  const [contadorDevolucion, setContadorDevolucion] = useState(1);
  const [contadorRecepcion, setContadorRecepcion] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.montoFinal && pagosProveedores.length > 0) {
      const montoFinalNum = parseFloat(formData.montoFinal);
      const totalPagos = pagosProveedores.reduce((sum, pago) => sum + (parseFloat(pago.valor) || 0), 0);
      const totalSaldo = pagosProveedores.reduce((sum, pago) => sum + (parseFloat(pago.saldo) || 0), 0);

      const diferenciaCalculada = totalSaldo - totalPagos;
      setDiferencia(diferenciaCalculada);
    } else {
      setDiferencia(null);
    }
  }, [formData.montoFinal, pagosProveedores]);

  const agregarPagoProveedor = () => {
    setPagosProveedores([...pagosProveedores, {
      id: Date.now(),
      proveedor: "",
      tipo_documento: "Factura",
      numero_documento: "",
      valor: "",
      saldo: "",
      pagado_por: ""
    }]);
  };

  const eliminarPagoProveedor = (id: number) => {
    setPagosProveedores(pagosProveedores.filter(pago => pago.id !== id));
  };

  const actualizarPagoProveedor = (id: number, campo: string, valor: any) => {
    setPagosProveedores(pagosProveedores.map(pago => {
      if (pago.id === id) {
        const updated = { ...pago, [campo]: valor };

        if (campo === "tipo_documento") {
          if (valor === "Doc. no autorizado") {
            updated.numero_documento = `DNA-${String(contadorDocNoAutorizado).padStart(4, "0")}`;
            setContadorDocNoAutorizado(contadorDocNoAutorizado + 1);
          } else if (valor === "Devolución") {
            updated.numero_documento = `DEV-${String(contadorDevolucion).padStart(4, "0")}`;
            setContadorDevolucion(contadorDevolucion + 1);
          } else if (valor === "Recepción") {
            updated.numero_documento = `REC-${String(contadorRecepcion).padStart(4, "0")}`;
            setContadorRecepcion(contadorRecepcion + 1);
          } else {
            updated.numero_documento = "";
          }
        }

        if (campo === "saldo") {
          const saldoNum = parseFloat(valor) || 0;
          if (formData.montoFinal && saldoNum > parseFloat(formData.montoFinal)) {
            toast({
              title: "Advertencia",
              description: "El saldo no puede ser mayor al monto final",
              variant: "destructive",
            });
          }
        }

        return updated;
      }
      return pago;
    }));
  };

  const loadData = async () => {
    try {
      const userId = "00000000-0000-0000-0000-000000000000";
      setUserId(userId);

      const { data: umbralParam } = await supabase
        .from("parametros")
        .select("valor")
        .eq("clave", "umbral_diferencia")
        .single();

      if (umbralParam) {
        setUmbralDiferencia(parseFloat(umbralParam.valor));
      }

      const { data: turnosData } = await supabase
        .from("turnos")
        .select(`
          id,
          fecha,
          hora_inicio,
          empleado_id,
          empleados (
            id,
            nombre_completo,
            cargo
          ),
          cajas (nombre, ubicacion),
          aperturas (
            id,
            monto_inicial,
            cerrada,
            fecha_hora
          )
        `)
        .eq("usuario_id", userId)
        .eq("estado", "abierto")
        .order("created_at", { ascending: false });

      if (turnosData && turnosData.length > 0) {
        const turnoConApertura = turnosData.find((t: any) =>
          t.aperturas && t.aperturas.length > 0 && !t.aperturas[0].cerrada
        );

        if (turnoConApertura) {
          setAperturaActiva({
            turno_id: turnoConApertura.id,
            apertura_id: turnoConApertura.aperturas[0].id,
            monto_inicial: turnoConApertura.aperturas[0].monto_inicial,
            caja: turnoConApertura.cajas,
            fecha: turnoConApertura.fecha,
            hora_inicio: turnoConApertura.hora_inicio,
            empleado: turnoConApertura.empleados,
            empleado_id: turnoConApertura.empleado_id,
          });

          if (turnoConApertura.empleado_id) {
            setFormData(prev => ({
              ...prev,
              empleadoId: turnoConApertura.empleado_id
            }));
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aperturaActiva) {
      toast({
        title: "Error",
        description: "No hay apertura activa para realizar arqueo",
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

    if (diferencia !== null && Math.abs(diferencia) > umbralDiferencia && !formData.comentario.trim()) {
      toast({
        title: "Comentario requerido",
        description: `La diferencia supera $${umbralDiferencia}. Debes agregar un comentario.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const montoContado = parseFloat(formData.montoContado);
      const montoFinal = parseFloat(formData.montoFinal);
      const montoEsperado = aperturaActiva.monto_inicial;
      const diferenciaFinal = diferencia || 0;

      const { data: arqueoData, error: arqueoError } = await supabase
        .from("arqueos")
        .insert({
          apertura_id: aperturaActiva.apertura_id,
          monto_contado: montoContado,
          monto_esperado: montoEsperado,
          monto_final: montoFinal,
          diferencia: diferenciaFinal,
          comentario: formData.comentario || null,
        })
        .select()
        .single();

      if (arqueoError) throw arqueoError;

      for (const pago of pagosProveedores) {
        if (pago.proveedor && pago.valor) {
          await supabase.from("pagos_proveedores").insert({
            proveedor: pago.proveedor,
            tipo_documento: pago.tipo_documento,
            numero_documento: pago.numero_documento,
            valor: parseFloat(pago.valor),
            saldo: parseFloat(pago.saldo) || 0,
            pagado_por: pago.pagado_por,
          });
        }
      }

      const { error: aperturaError } = await supabase
        .from("aperturas")
        .update({ cerrada: true })
        .eq("id", aperturaActiva.apertura_id);

      if (aperturaError) throw aperturaError;

      const { error: turnoError } = await supabase
        .from("turnos")
        .update({
          estado: "cerrado",
          hora_fin: new Date().toTimeString().slice(0, 5),
          empleado_id: formData.empleadoId
        })
        .eq("id", aperturaActiva.turno_id);

      if (turnoError) throw turnoError;

      toast({
        title: "Arqueo completado",
        description: "El turno ha sido cerrado correctamente",
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

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!aperturaActiva) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Arqueo de Caja</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 max-w-4xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes ninguna apertura activa. Debes abrir una caja antes de realizar un arqueo.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/apertura-caja")} className="mt-4">
            Ir a Apertura de Caja
          </Button>
        </main>
      </div>
    );
  }

  const requiereComentario = diferencia !== null && Math.abs(diferencia) > umbralDiferencia;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Arqueo de Caja</h1>
              <p className="text-sm text-muted-foreground">Cierre de turno</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Turno Activo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Caja:</span>
                <span className="font-medium">{aperturaActiva.caja.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{new Date(aperturaActiva.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hora inicio:</span>
                <span className="font-medium">{aperturaActiva.hora_inicio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto inicial:</span>
                <span className="font-medium text-lg">${aperturaActiva.monto_inicial.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Empleado</Label>
              <EmpleadoSelector
                value={formData.empleadoId}
                onChange={(value) => setFormData({ ...formData, empleadoId: value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoFinal">Monto Final (USD)</Label>
              <Input
                id="montoFinal"
                type="number"
                step="0.01"
                min="0"
                value={formData.montoFinal}
                onChange={(e) => setFormData({ ...formData, montoFinal: e.target.value })}
                placeholder="0.00"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Este monto representa el saldo total de ventas del turno
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pagos a Proveedores</CardTitle>
                <CardDescription>
                  Registra los pagos realizados durante el turno
                </CardDescription>
              </div>
              <Button type="button" size="sm" onClick={agregarPagoProveedor}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar Pago
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pagosProveedores.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay pagos registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Proveedor</TableHead>
                      <TableHead className="min-w-[150px]">Documento</TableHead>
                      <TableHead className="min-w-[150px]">Número</TableHead>
                      <TableHead className="min-w-[120px]">Valor</TableHead>
                      <TableHead className="min-w-[120px]">Saldo</TableHead>
                      <TableHead className="min-w-[150px]">Pagado por</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagosProveedores.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell>
                          <Input
                            value={pago.proveedor}
                            onChange={(e) => actualizarPagoProveedor(pago.id, "proveedor", e.target.value)}
                            placeholder="Nombre del proveedor"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={pago.tipo_documento}
                            onValueChange={(value) => actualizarPagoProveedor(pago.id, "tipo_documento", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Factura">Factura</SelectItem>
                              <SelectItem value="Nota de venta">Nota de venta</SelectItem>
                              <SelectItem value="Doc. no autorizado">Doc. no autorizado</SelectItem>
                              <SelectItem value="Devolución">Devolución</SelectItem>
                              <SelectItem value="Recepción">Recepción</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={pago.numero_documento}
                            onChange={(e) => actualizarPagoProveedor(pago.id, "numero_documento", e.target.value)}
                            placeholder="Número"
                            disabled={["Doc. no autorizado", "Devolución", "Recepción"].includes(pago.tipo_documento)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={pago.valor}
                            onChange={(e) => actualizarPagoProveedor(pago.id, "valor", e.target.value)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={pago.saldo}
                            onChange={(e) => actualizarPagoProveedor(pago.id, "saldo", e.target.value)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={pago.pagado_por}
                            onChange={(e) => actualizarPagoProveedor(pago.id, "pagado_por", e.target.value)}
                            placeholder="Empleado"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => eliminarPagoProveedor(pago.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {pagosProveedores.length > 0 && (
              <div className="mt-6 flex justify-end">
                <div className="space-y-2 text-right bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    Total Pagado: <span className="text-lg">${pagosProveedores.reduce((sum, pago) => sum + (parseFloat(pago.valor) || 0), 0).toFixed(2)}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Total Saldo: <span className="text-lg">${pagosProveedores.reduce((sum, pago) => sum + (parseFloat(pago.saldo) || 0), 0).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteo de Efectivo</CardTitle>
            <CardDescription>
              Registra el monto total contado en caja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="montoContado">Monto Contado (USD)</Label>
                <Input
                  id="montoContado"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montoContado}
                  onChange={(e) => setFormData({ ...formData, montoContado: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full"
                />
              </div>

              {diferencia !== null && (
                <Alert variant={Math.abs(diferencia) > umbralDiferencia ? "destructive" : "default"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Diferencia: ${diferencia.toFixed(2)}</strong>
                    <p className="mt-1 text-sm">
                      Diferencia entre Total Saldo y Total Pagado
                    </p>
                    {Math.abs(diferencia) > umbralDiferencia && (
                      <p className="mt-1 text-sm font-medium">
                        Supera el umbral de $±{umbralDiferencia.toFixed(2)}. Es obligatorio agregar un comentario.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="comentario">
                  Comentario {requiereComentario && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id="comentario"
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  placeholder="Explica el motivo de la diferencia si existe..."
                  rows={4}
                  required={requiereComentario}
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
                  Generar Arqueo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ArqueoCaja;
