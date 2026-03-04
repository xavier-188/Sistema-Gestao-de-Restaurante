public class Reserva
{
    public int ReservaId { get; set; }
    
    public DateTime DataHoraInicio { get; set; }
    public DateTime DataHoraFim { get; set; }

    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }

    public int MesaId { get; set; }
    public Mesa? Mesa { get; set; }
}