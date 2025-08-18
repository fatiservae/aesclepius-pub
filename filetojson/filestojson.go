package main

import (
    "encoding/json"
    "fmt"
    "os"
    "path/filepath"
    "strings"
)

type FileInfo struct {
    Name     string   `json:"name"`
    Subjects []string `json:"subjects"`
    Size     string   `json:"size"`
    Path     string   `json:"path"`
}

func formatSize(size int64) string {
    const (
        KB = 1024 
        MB = 1000000
        GB = 1000000000
        TB = 1000000000000
        PB = 1000000000000000
        EB = 1000000000000000000
    )

    var unit string
    var value float64

    switch {
    case size >= EB:
        unit = "EB"
        value = float64(size) / float64(EB)
    case size >= PB:
        unit = "PB"
        value = float64(size) / float64(PB)
    case size >= TB:
        unit = "TB"
        value = float64(size) / float64(TB)
    case size >= GB:
        unit = "GB"
        value = float64(size) / float64(GB)
    case size >= MB:
        unit = "MB"
        value = float64(size) / float64(MB)
    case size >= KB:
        unit = "KB"
        value = float64(size) / float64(KB)
    default:
        unit = "bytes"
        value = float64(size)
    }

    return fmt.Sprintf("%.2f %s", value, unit)
}

func main() {
    filesInfo := make([]FileInfo, 0)

    err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }
        if !info.IsDir() {
            subjects := make([]string, 0)
            dir := filepath.Dir(path)
            dirs := strings.Split(dir, string(os.PathSeparator))
            for _, d := range dirs {
                if d != "." {
                    subjects = append(subjects, d)
                }
            }
            file := FileInfo{
                Name: info.Name(),
                Subjects: subjects,
                Path: dir,
                Size: formatSize(info.Size()),
            }
            filesInfo = append(filesInfo, file)
        }
        return nil
    })

    if err != nil {
        fmt.Println("Error:", err)
        return
    }

    jsonData, err := json.MarshalIndent(filesInfo, "", "  ")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }

    fmt.Println(string(jsonData))
}
