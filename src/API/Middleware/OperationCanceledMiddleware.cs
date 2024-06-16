public class OperationCanceledMiddleware(RequestDelegate next) {
  public async Task InvokeAsync(HttpContext context) {
    try {
      await next(context);
    } catch (OperationCanceledException) {
      Console.WriteLine("Client closed connection.");
    }
  }
}