$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
} catch {
    Write-Host "Failed to start listener on port $port : $_"
    exit 1
}

$mimeMap = @{
    ".html" = "text/html; charset=utf-8";
    ".htm"  = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".jsx"  = "application/javascript; charset=utf-8";
    ".ts"   = "application/javascript; charset=utf-8";
    ".tsx"  = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".svg"  = "image/svg+xml";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".png"  = "image/png";
    ".gif"  = "image/gif";
    ".webp" = "image/webp";
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            # Add CORS headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "*")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.Close()
                continue
            }

            $path = $request.Url.LocalPath
            if ($path -eq "/" -or [string]::IsNullOrEmpty($path)) {
                $path = "/index.html"
            }
            $localPath = Join-Path (Get-Location) ($path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar))

            if (Test-Path $localPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $bytes.LongLength
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $buffer.LongLength
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            $response.OutputStream.Flush()
            $response.Close()
        } catch {
            Write-Host "Request error: $_"
        }
    }
} finally {
    $listener.Stop()
}
