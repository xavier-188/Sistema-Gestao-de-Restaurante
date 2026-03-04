using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddCors(options =>
  options.AddPolicy("Acesso Total",
    configs => configs
      .AllowAnyOrigin()
      .AllowAnyHeader()
      .AllowAnyMethod())
);

var app = builder.Build();
app.UseCors("AllowAll");

app.MapGet("/", () => "Restaurante");

//Endpoints de Cliente

app.MapGet("/api/restaurante/cliente/listar", ([FromServices] AppDbContext ctx) =>
{
    if (ctx.Clientes.Any())
    {
        return Results.Ok(ctx.Clientes.ToList());
    }
    return Results.BadRequest("A lista de clientes está vazia!");

});

app.MapGet("/api/restaurante/cliente/buscar/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx) =>
{
    var clienteBuscado = ctx.Clientes.Find(id);
    if (clienteBuscado == null)
        return Results.NotFound("Cliente não encontrado.");
    return Results.Ok(clienteBuscado);

});

app.MapPost("/api/restaurante/cliente/cadastrar", ([FromBody] Cliente cliente, [FromServices] AppDbContext ctx) =>
{
    var existente = ctx.Clientes.FirstOrDefault(c => c.Email == cliente.Email);
    if (existente != null)
        return Results.Conflict("Cliente já cadastrado!");

    ctx.Clientes.Add(cliente);
    ctx.SaveChanges();
    return Results.Created("", cliente);

});

app.MapDelete("/api/restaurante/cliente/remover/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx) =>
{

    Cliente? clienteBuscado = ctx.Clientes.Find(id);
    if (clienteBuscado == null)
    {
        return Results.NotFound("Cliente não encontrado!");
    }

    ctx.Clientes.Remove(clienteBuscado);
    ctx.SaveChanges();
    return Results.Ok("Cliente Removido!");

});

app.MapPatch("/api/restaurante/cliente/alterar/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx, [FromBody] Cliente clienteAlterado) =>
{
    Cliente? clienteBuscado = ctx.Clientes.Find(id);
    if (clienteBuscado == null)
    {
        return Results.NotFound("Cliente não encontrado!");
    }
    clienteBuscado.Nome = clienteAlterado.Nome;
    clienteBuscado.Email = clienteAlterado.Email;
    clienteBuscado.Telefone = clienteAlterado.Telefone;

    ctx.Clientes.Update(clienteBuscado);
    ctx.SaveChanges();
    return Results.Ok("Cliente alterado com sucesso!");

});


//Endpoints de Mesa

app.MapGet("/api/restaurante/mesa/listar", ([FromServices] AppDbContext ctx) =>
{
    if (ctx.Mesas.Any())
    {
        return Results.Ok(ctx.Mesas.ToList());
    }
    return Results.BadRequest("A lista de mesas está vazia!");

});

app.MapGet("/api/restaurante/mesa/buscar/{numero}", ([FromRoute] int numero, [FromServices] AppDbContext ctx) =>
{
    Mesa? mesaBuscada = ctx.Mesas.FirstOrDefault(m => m.Numero == numero);
    if (mesaBuscada == null)
    {
        return Results.NotFound("Mesa não encontrada!");
    }
    return Results.Ok(mesaBuscada);

});

app.MapPost("/api/restaurante/mesa/cadastrar", ([FromBody] Mesa mesa, [FromServices] AppDbContext ctx) =>
{
    var existente = ctx.Mesas.FirstOrDefault(m => m.Numero == mesa.Numero);
    if (existente != null)
        return Results.Conflict("Mesa já cadastrada!");

    ctx.Mesas.Add(mesa);
    ctx.SaveChanges();
    return Results.Created("", mesa);

});

app.MapDelete("/api/restaurante/mesa/remover/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx) =>
{

    Mesa? mesaBuscada = ctx.Mesas.Find(id);
    if (mesaBuscada == null)
    {
        return Results.NotFound("Mesa não encontrada");
    }

    ctx.Mesas.Remove(mesaBuscada);
    ctx.SaveChanges();
    return Results.Ok("Mesa Removida!");

});

app.MapPatch("/api/restaurante/mesa/alterar/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx, [FromBody] Mesa mesaAlterada) =>
{
    Mesa? mesaBuscada = ctx.Mesas.Find(id);
    if (mesaBuscada == null)
    {
        return Results.NotFound("Cliente não encontrado!");
    }
    mesaBuscada.Numero = mesaAlterada.Numero;
    mesaBuscada.Capacidade = mesaAlterada.Capacidade;

    ctx.Mesas.Update(mesaBuscada);
    ctx.SaveChanges();
    return Results.Ok("Mesa alterada com sucesso!");

});

//Endpoints de Reserva

app.MapGet("/api/restaurante/reserva/listar", ([FromServices] AppDbContext ctx) =>
{
    var reservas = ctx.Reservas
        .Include(r => r.Cliente)
        .Include(r => r.Mesa)
        .ToList();

    if (reservas.Any())
    {
        return Results.Ok(reservas);
    }
    return Results.NotFound("Nenhuma reserva encontrada.");
});

app.MapGet("/api/restaurante/reserva/buscar/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx) =>
{
    var reserva = ctx.Reservas
        .Include(r => r.Cliente)
        .Include(r => r.Mesa)
        .FirstOrDefault(r => r.ReservaId == id);

    if (reserva == null)
        return Results.NotFound("Reserva não encontrada.");

    return Results.Ok(reserva);
});

app.MapPost("/api/restaurante/reserva/cadastrar", ([FromBody] Reserva reserva, [FromServices] AppDbContext ctx) =>
{
    var cliente = ctx.Clientes.Find(reserva.ClienteId);
    if (cliente == null)
        return Results.NotFound("Cliente não encontrado.");

    var mesa = ctx.Mesas.Find(reserva.MesaId);
    if (mesa == null)
        return Results.NotFound("Mesa não encontrada.");

    if (reserva.DataHoraInicio == default)
        return Results.BadRequest("Data de início inválida.");


    TimeSpan duracao = TimeSpan.FromHours(2);
    var inicioNova = reserva.DataHoraInicio;
    var fimNova = inicioNova.Add(duracao);


    reserva.DataHoraFim = fimNova;

    bool conflito = ctx.Reservas.Any(r =>
        r.MesaId == reserva.MesaId &&
        r.DataHoraInicio < fimNova &&
        r.DataHoraFim > inicioNova
    );

    if (conflito)
        return Results.Conflict("Já existe reserva nesse horário para essa mesa.");

    ctx.Reservas.Add(reserva);
    ctx.SaveChanges();

    return Results.Created($"/api/reserva/buscar/{reserva.ReservaId}", reserva);
});

app.MapPatch("/api/restaurante/reserva/alterar/{id}", ([FromRoute] int id, [FromBody] Reserva reservaAlterada, [FromServices] AppDbContext ctx) =>
{
    var reservaBuscada = ctx.Reservas.Find(id);
    if (reservaBuscada == null)
        return Results.NotFound("Reserva não encontrada.");

    var clienteExiste = ctx.Clientes.Any(c => c.Id == reservaAlterada.ClienteId);
    if (!clienteExiste)
        return Results.NotFound("Cliente não encontrado.");

    var mesaExiste = ctx.Mesas.Any(m => m.Id == reservaAlterada.MesaId);
    if (!mesaExiste)
        return Results.NotFound("Mesa não encontrada.");

    if (reservaAlterada.DataHoraInicio == default)
        return Results.BadRequest("Data de início inválida.");

    // 🔥 regra fixa de 2 horas
    TimeSpan duracao = TimeSpan.FromHours(2);
    var inicioNovo = reservaAlterada.DataHoraInicio;
    var fimNovo = inicioNovo.Add(duracao);

    bool conflito = ctx.Reservas.Any(r =>
        r.ReservaId != id &&
        r.MesaId == reservaAlterada.MesaId &&
        r.DataHoraInicio < fimNovo &&
        r.DataHoraFim > inicioNovo
    );

    if (conflito)
        return Results.Conflict("A mesa já está reservada nesse intervalo.");

    reservaBuscada.ClienteId = reservaAlterada.ClienteId;
    reservaBuscada.MesaId = reservaAlterada.MesaId;
    reservaBuscada.DataHoraInicio = inicioNovo;
    reservaBuscada.DataHoraFim = fimNovo;

    ctx.SaveChanges();

    return Results.Ok("Reserva alterada com sucesso!");
});

app.MapDelete("/api/restaurante/reserva/remover/{id}", ([FromRoute] int id, [FromServices] AppDbContext ctx) =>
{
    Reserva? reserva = ctx.Reservas.Find(id);
    if (reserva == null)
        return Results.NotFound("Reserva não encontrada.");

    ctx.Reservas.Remove(reserva);
    ctx.SaveChanges();
    return Results.Ok("Reserva removida com sucesso!");
});
app.UseCors("Acesso Total");

app.Run();
