import React, { useState } from "react";
import { Form, Modal, Badge, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../services/store/store";
import { publishUnpublishOffer } from "../../services/slices/business/businessSlice";
import { FaBullhorn, FaPowerOff, FaCheckCircle } from "react-icons/fa";

const PublishUnpublish = ({ show, handleClose, offerItem }) => {
  const [switchValue, setSwichValue] = useState(offerItem?.is_published || false)
  const dispatch = useDispatch<AppDispatch>();
  const handleSwitchToggle = async (event: any) => {
    const isChecked = event.target.checked;
    setSwichValue(isChecked);
    const data = { is_published: isChecked };
    dispatch(publishUnpublishOffer({ payload: data, offer_id: offerItem.id, business_id: offerItem?.business_id }))
    handleClose();
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-normal fs-6">
          <FaBullhorn className="me-2 text-primary" />
          Manage Offer Visibility: {offerItem?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="table-responsive">
        <div className="mb-3">
          <h5 className="mb-1 fw-semibold">{offerItem?.title}</h5>
          <p className="mb-0 text-muted">Control whether this offer is visible to customers.</p>
        </div>
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-medium">
              Status:
              <Badge bg={switchValue ? "success" : "secondary"}>
                {switchValue ? "Published" : "Unpublished"}
              </Badge>
            </span>
            <Form.Check
              type="switch"
              id="offer-toggle-switch"
              label={switchValue ? "Turn Off" : "Publish Offer"}
              checked={switchValue}
              onChange={handleSwitchToggle}
            />
          </div>
          <div className="text-center text-muted small">
            {switchValue ? (
              <div className="gap-1 mt-5 d-flex align-items-center justify-content-center">
                <FaCheckCircle className=" text-success" />
                <div>This offer is now live and visible to community offers</div>
              </div>
            ) : (
              <>
                <FaPowerOff className="text-secondary me-2" />
                This offer is currently hidden.
              </>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PublishUnpublish;
