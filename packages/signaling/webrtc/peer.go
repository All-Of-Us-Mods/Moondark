package webrtc

import (
	"encoding/json"

	"github.com/pion/webrtc/v4"
)

type Offer struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}

type Answer struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}

type Candidate struct {
	Candidate    string `json:"candidate"`
	SDPMid       string `json:"sdpMid"`
	SDPMLineIndex uint16 `json:"sdpMLineIndex"`
}

type Peer struct {
	ID         string
	PC         *webrtc.PeerConnection
	DataChannel *webrtc.DataChannel
}

func NewPeer(sessionID string) (*Peer, error) {
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	pc, err := webrtc.NewPeerConnection(config)
	if err != nil {
		return nil, err
	}

	peer := &Peer{
		ID: sessionID,
		PC: pc,
	}

	dc, err := pc.CreateDataChannel("input", nil)
	if err != nil {
		return nil, err
	}

	peer.DataChannel = dc

	dc.OnOpen(func() {
		println("Data channel opened for session", sessionID)
	})

	dc.OnMessage(func(msg webrtc.DataChannelMessage) {
		println("Received from client:", string(msg.Data))
	})

	return peer, nil
}

func (p *Peer) HandleOffer(offer Offer) (*Answer, error) {
	sd := webrtc.SessionDescription{
		Type: webrtc.SDPTypeOffer,
		SDP:  offer.SDP,
	}

	if err := p.PC.SetRemoteDescription(sd); err != nil {
		return nil, err
	}

	answer, err := p.PC.CreateAnswer(nil)
	if err != nil {
		return nil, err
	}

	if err := p.PC.SetLocalDescription(answer); err != nil {
		return nil, err
	}

	return &Answer{
		SDP:  answer.SDP,
		Type: string(answer.Type),
	}, nil
}

func (p *Peer) AddCandidate(cand Candidate) error {
	return p.PC.AddICECandidate(webrtc.ICECandidateInit{
		Candidate:    cand.Candidate,
		SDPMid:       &cand.SDPMid,
		SDPMLineIndex: &cand.SDPMLineIndex,
	})
}

func (p *Peer) SendInput(inputType string, data map[string]interface{}) {
	if p.DataChannel == nil {
		return
	}

	payload := map[string]interface{}{
		"type": inputType,
		"data": data,
	}

	bytes, _ := json.Marshal(payload)
	p.DataChannel.SendText(string(bytes))
}
