using System.Text.Json.Serialization;
public class Mesa
{
    public int Id { get; set; }
    public int Numero { get; set; }
    public int Capacidade { get; set; }
    
    [JsonIgnore]
    public List<Reserva>? Reservas { get; set; }
}
