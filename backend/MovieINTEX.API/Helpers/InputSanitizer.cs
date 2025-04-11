namespace MovieINTEX.Helpers
{
    public static class InputSanitizer
    {
        public static string SanitizeInput(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;
            // Trim whitespace and strip some common injection characters
            var sanitized = input.Trim();
            // You can customize this based on your needs
            sanitized = sanitized.Replace("'", "")
                .Replace("\"", "")
                .Replace(";", "")
                .Replace("--", "")
                .Replace("<", "")
                .Replace(">", "");
            // Optionally limit length
            if (sanitized.Length > 100)
                sanitized = sanitized.Substring(0, 100);
            return sanitized;
        }
    }
}