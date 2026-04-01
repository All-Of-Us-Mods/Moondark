package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"moondark/signaling/webrtc"
)

type OfferRequest struct {
	SessionID string      `json:"sessionId"`
	Offer     webrtc.Offer `json:"offer"`
}

type IceRequest struct {
	SessionID string        `json:"sessionId"`
	Candidate webrtc.Candidate `json:"candidate"`
}

type InputRequest struct {
	SessionID string                 `json:"sessionId"`
	Type      string                 `json:"type"`
	Data      map[string]interface{} `json:"data"`
}

var (
	peers = make(map[string]*webrtc.Peer)
	mu    sync.RWMutex
)

func handleOffer(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OfferRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	peer, err := webrtc.NewPeer(req.SessionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	mu.Lock()
	peers[req.SessionID] = peer
	mu.Unlock()

	answer, err := peer.HandleOffer(req.Offer)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(answer)
}

func handleIce(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req IceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.RLock()
	peer, ok := peers[req.SessionID]
	mu.RUnlock()

	if !ok {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	}

	if err := peer.AddCandidate(req.Candidate); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func handleInput(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req InputRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.RLock()
	peer, ok := peers[req.SessionID]
	mu.RUnlock()

	if !ok {
		http.Error(w, "Session not found", http.StatusNotFound)
		return
	}

	peer.SendInput(req.Type, req.Data)
	w.WriteHeader(http.StatusOK)
}

func main() {
	http.HandleFunc("/offer", handleOffer)
	http.HandleFunc("/ice", handleIce)
	http.HandleFunc("/input", handleInput)

	addr := ":3002"
	fmt.Printf("Signaling server running at http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
