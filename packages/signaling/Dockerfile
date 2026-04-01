FROM golang:1.26-alpine AS builder
WORKDIR /app

COPY packages/signaling/go.mod packages/signaling/go.sum ./
RUN go mod download

COPY packages/signaling/main.go ./
COPY packages/signaling/webrtc/ ./webrtc/

RUN CGO_ENABLED=0 go build -o /signaling .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /signaling .

EXPOSE 3002
CMD ["/root/signaling"]
