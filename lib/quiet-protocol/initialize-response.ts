import * as assert from "assert";

import {
    QuietProtocolOpcode,
    QuietProtocolPacket,
    QuietProtocolResponseCode
} from "./index";

export interface InitializeResponsePacket extends QuietProtocolPacket {
    responseCode: QuietProtocolResponseCode;
    name: string;
}

export function encodeInitializeResponsePacket(responseCode: QuietProtocolResponseCode, name: string): Buffer {
    const payloadSize = 2 + name.length;
    const packet = Buffer.allocUnsafe(1 + 2 + payloadSize);

    let offset = 0;
    packet.writeUInt8(QuietProtocolOpcode.INITIALIZE_RESPONSE, offset);
    offset += 1;
    packet.writeUInt16BE(payloadSize, offset);                      offset += 2;

    packet.writeUInt16BE(responseCode, offset);                     offset += 2;
    packet.write(name, offset);                                     offset += name.length;

    return packet;
}

export function decodeInitializeResponsePacket(packet: Buffer): InitializeResponsePacket {
    assert(
        packet.length >= 2,
        `decodeInitializeResponsePacket: Expected payload length to be at least 2, got ${packet.length}`
    );

    let offset = 0;
    const responseCode = packet.readUInt16BE(offset);               offset += 2;
    const name = packet.slice(offset).toString();                   offset += name.length;

    return {
        opcode: QuietProtocolOpcode.INITIALIZE_RESPONSE,
        responseCode,
        name
    };
}
