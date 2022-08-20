using Microsoft.AspNetCore.SignalR;

namespace TicTacToeSignalR.Hubs
{
    public class MainHub : Hub
    {
        public async Task SendMove(string user, int index){

            
            await Clients.All.SendAsync("UserMove", user, index);
            await Clients.Caller.SendAsync("DisableTurn");
            await Clients.Others.SendAsync("EnableTurn");
            
        }
        public async Task ClearBoard(){
            await Clients.All.SendAsync("ClearBoard");
            await Clients.Caller.SendAsync("UserX");
            await Clients.Others.SendAsync("UserO");
        }
    }
}
