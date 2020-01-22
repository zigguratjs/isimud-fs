# Introduction

## Description

Nabu is a set of tools for reading and writing Ziggurat content on disk. It allows us to store collections in files with support for common formats like JSON, YAML or Markdown.

## Installation

```text
$ npm install @ziggurat/nabu
```

## Usage

The package exports a component that should be imported as a dependency in your application. It can also optionally be configured to watch for changes to files on disk.

```typescript
@component({
  dependencies: [
    import('@ziggurat/nabu')
  ],
  providers: [
    Provider.ofInstance<FileSystemConfig>('nabu.FileSystemConfig', {
      watch: true
    })
  ]
})
class Application {}
```
