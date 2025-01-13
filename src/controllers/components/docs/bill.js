import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Estilos para el diseño de eBay
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoSection: {
    width: "50%",
  },
  titleSection: {
    width: "50%",
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  address: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  tableColHeader: {
    width: "33%",
    fontWeight: "bold",
  },
  tableCol: {
    width: "33%",
  },
  summary: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});


const InvoiceDocument = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          {/* Información de la empresa */}
          <View style={styles.companyInfo}>
            <Text>Autorect</Text>
            <Text>San salvador.</Text>
            <Text>San salvador.</Text>
            <Text>El Salvador</Text>
          </View>
        </View>
      </View>

      {/* Sección de detalles del cliente */}
      <View style={styles.section}>
        <Text style={styles.address}>información del cliente</Text>
        <Text>Usuario: {invoiceData.usuario}</Text>
        <Text>Dirección: {invoiceData.direccion}</Text>
      </View>

      {/* Tabla de resumen de ítems */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableColHeader}>Producto</Text>
          <Text style={styles.tableColHeader}>Tienda</Text>
          <Text style={styles.tableColHeader}>Cantidad</Text>
          <Text style={styles.tableColHeader}>Precio unitario</Text>
        </View>
        {invoiceData.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{item.nombre}</Text>
            <Text style={styles.tableCol}>{item.tienda}</Text>
            <Text style={styles.tableCol}>{item.cantidad}</Text>
            <Text style={styles.tableCol}>${item.precioUnitario.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Resumen */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Subtotal:</Text>
          <Text>${invoiceData.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Impuestos:</Text>
          <Text>${invoiceData.impuestos.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total:</Text>
          <Text>${invoiceData.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Pie de página */}
      <Text style={styles.footer}>
        Muchas gracias por utilizar autorect.
      </Text>
    </Page>
  </Document>
);

export default InvoiceDocument;
