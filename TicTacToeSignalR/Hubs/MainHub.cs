using Microsoft.AspNetCore.SignalR;
using TicTacToeSignalR.Models;
namespace TicTacToeSignalR.Hubs
{
    public class MainHub : Hub
    {
        public async Task SendMove(string user, int index)
        {
            await Clients.All.SendAsync("UserMove", user, index);
            await Clients.Caller.SendAsync("DisableTurn");
            await Clients.Others.SendAsync("EnableTurn");

        }
        public async Task ClearBoard()
        {
            await Clients.All.SendAsync("ClearBoard");
            await Clients.Caller.SendAsync("UserX");
            await Clients.Others.SendAsync("UserO");
        }

        public async Task InitGameWithClient(string opponentId, string myId){

            await Clients.Caller.SendAsync("ClearBoard");
            await Clients.Client(opponentId).SendAsync("ClearBoard");
            await Clients.Caller.SendAsync("UserX");
            await Clients.Client(opponentId).SendAsync("UserO");
            await Clients.Client(opponentId).SendAsync("GetOpponentId", myId);
        }

        public async Task SendMoveToClient(string opponentId, string user, int index){

            await Clients.Caller.SendAsync("UserMove", user, index);
            await Clients.Client(opponentId).SendAsync("UserMove", user, index);
            await Clients.Caller.SendAsync("DisableTurn");
            await Clients.Client(opponentId).SendAsync("EnableTurn");
        }



        public override async Task OnConnectedAsync()
        {
            User.connectionIds.Add(Context.ConnectionId);
            await Clients.Caller.SendAsync("MyConnectionId", Context.ConnectionId);
            await Clients.All.SendAsync("UserConnected", User.connectionIds);
            
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            User.connectionIds.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("UserDisconnected", User.connectionIds);
            await base.OnDisconnectedAsync(ex);
        }
    }
}
